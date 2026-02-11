---
title: 04-自定义QueryWrapper与sql结合查询
date: 2023-10-28 10:11:56
tags:
- mybatis
- mybatisPlus
- QueryWrapper
- sql
categories:
- 05_数据库
- 03_MyBatis-Plus
---



**核心技术点**：

1. QueryWrapper 可以`指定表的别名`，但是要显式的字段，而不是 LambdaQueryWrapper的::获取字段
2. QueryWrapper 的入参使用 `@Param(Constants.WRAPPER) QueryWrapper<Xxx> qw` 接收
   * `Constants.WRAPPER = "ew"`;  且只能是这个值，不能使用其他值否则会因找不到ew而报错
3. QueryWrapper 接收到的入参使用 `${ew.customSqlSegment}` 来进行拼接sql
4. 显式接收 Page 参数时，使用 `@Param("offset") Page<Xxx> page` 即 offset 来接收，自动追加sql

### 示例 service 方法

```java
    @Override
    public Page<SendRecordListDTO> sendRecordList(SendRecordListQueryDTO dto) {
        QueryWrapper<RoomReportStatisticsEntity> lqw = new QueryWrapper<>();
        lqw.eq("rrs.wx_corp_id", dto.getWxCorpId());
        if (StrUtil.isNotEmpty(dto.getRoomName())) {
            lqw.like("rrs.room_name", dto.getRoomName());
        }
        if (StrUtil.isNotEmpty(dto.getPrincipalName())) {
            lqw.like("rrs.principal_user_name", dto.getPrincipalName());
        }
        List<OrderItem> orders = dto.getOrders();
        if (ObjUtil.isNotEmpty(orders)) {
            for (OrderItem order : orders) {
                if (order.isAsc()) {
                    if ("sendCount".equals(order.getColumn())) {
                        lqw.orderByAsc("rrs.have_send_total");
                    } else if ("pushTime".equals(order.getColumn())) {
                        lqw.orderByAsc("rrs.last_push_time");
                    } else if ("sendDate".equals(order.getColumn())) {
                        lqw.orderByAsc("rrs.last_send_time");
                    }
                } else {
                    if ("sendCount".equals(order.getColumn())) {
                        lqw.orderByDesc("rrs.have_send_total");
                    } else if ("pushTime".equals(order.getColumn())) {
                        lqw.orderByDesc("rrs.last_push_time");
                    } else if ("sendDate".equals(order.getColumn())) {
                        lqw.orderByDesc("rrs.last_send_time");
                    }
                }
            }
        } else {
            //默认排序方式：最后推送时间倒序
            lqw.orderByDesc("rrs.last_push_time");
        }
        Integer dateSearchType = dto.getDateSearchType();
        String beginDate = dto.getBeginDate();
        String endDate = dto.getEndDate();
        if (ObjUtil.isNotNull(dateSearchType) && StrUtil.isNotEmpty(beginDate) && StrUtil.isNotEmpty(endDate)) {
            if (1 == dateSearchType) {
                lqw.gt("rrs.last_push_time", beginDate);
                lqw.lt("rrs.last_push_time", endDate);
            } else {
                lqw.gt("rrs.last_send_time", beginDate);
                lqw.lt("rrs.last_send_time", endDate);
            }
        }
        Page<RoomReportStatisticsEntity> page = new Page<>(dto.getCurrent(), dto.getSize());
        List<SendRecordListDTO> resList = Lists.newArrayList();

        Page<RoomReportStatisticsEntity> pageResult = roomReportStatisticsService.selectEntityPage(
                lqw, dateSearchType, beginDate, endDate, page
        );
        log.info("pageResult -> {}", pageResult);
        if (ObjUtil.isNotEmpty(pageResult)) {
            List<RoomReportStatisticsEntity> records = pageResult.getRecords();
            if (ObjUtil.isNotEmpty(records)) {
                records.forEach(r -> {
                    SendRecordListDTO sendRecordListDTO = new SendRecordListDTO();
                    sendRecordListDTO.setRoomId(r.getRoomId());
                    sendRecordListDTO.setRoomName(r.getRoomName());
                    sendRecordListDTO.setProjectName(r.getSopName());
                    sendRecordListDTO.setStepTaskName(r.getSopCurrentStep());
                    sendRecordListDTO.setPrincipalUserId(r.getPrincipalUserId());
                    sendRecordListDTO.setPrincipalName(r.getPrincipalUserName());
                    sendRecordListDTO.setTemplateTypeCount(r.getNeedSendTotal());
                    sendRecordListDTO.setSendCount(r.getHaveSendTotal());
                    sendRecordListDTO.setPushTime(r.getLastPushTime());
                    sendRecordListDTO.setSendDate(r.getLastSendTime());
                    resList.add(sendRecordListDTO);
                });
            }
        }
        Page<SendRecordListDTO> resPage = new Page<>(dto.getCurrent(), dto.getSize());
        resPage.setTotal(pageResult.getTotal());
        resPage.setRecords(resList);
        return resPage;
    }
```

### 示例 dao 方法

```java
    @Override
    public Page<RoomReportStatisticsEntity> selectEntityPage(QueryWrapper<RoomReportStatisticsEntity> lqw,
                                                             Integer dateSearchType,
                                                             String beginDate,
                                                             String endDate,
                                                             Page<RoomReportStatisticsEntity> page) {
        return roomReportStatisticsDao.selectEntityPage(lqw, dateSearchType, beginDate, endDate, page);
    }
```

```java
    Page<RoomReportStatisticsEntity> selectEntityPage(@Param(Constants.WRAPPER) QueryWrapper<RoomReportStatisticsEntity> qw,
                                                      @Param("dateSearchType") Integer dateSearchType,
                                                      @Param("beginDate") String beginDate,
                                                      @Param("endDate") String endDate,
                                                      @Param("offset") Page<RoomReportStatisticsEntity> page);
}
```

### 示例 Mapper 方法

```xml
<select id="selectEntityPage" resultType="com...RoomReportStatisticsEntity">
        SELECT rrs.id,
               rrs.wx_corp_id,
               rrs.room_id,
               rrs.room_name,
               rrs.sop_name,
               rrs.sop_current_step,
               rrs.principal_user_id,
               rrs.principal_user_name,
               (SELECT COUNT(*)
                FROM room_report_file_record rrfr
                WHERE rrfr.wx_corp_id = rrs.wx_corp_id
                  AND rrfr.room_id = rrs.room_id
                    <choose>
                        <when test="dateSearchType == 1 and beginDate != null and beginDate != '' and endDate != null and endDate != ''">
                            AND rrfr.update_date BETWEEN '${beginDate}' AND '${endDate}'
                        </when>
                    </choose>
               ) AS need_send_total,
               (SELECT COUNT(*)
                FROM room_report_send_record rrsr
                WHERE rrsr.wx_corp_id = rrs.wx_corp_id
                  AND rrsr.room_id = rrs.room_id
                    <choose>
                        <when test="dateSearchType == 2 and beginDate != null and beginDate != '' and endDate != null and endDate != ''">
                            AND rrsr.update_date BETWEEN '${beginDate}' AND '${endDate}'
                        </when>
                    </choose>
               ) AS have_send_total,
               rrs.last_push_time,
               rrs.last_send_time,
               rrs.create_date,
               rrs.update_date
        FROM room_report_statistics rrs
        <if test="ew != null">
            ${ew.customSqlSegment}
        </if>
    </select>
```

