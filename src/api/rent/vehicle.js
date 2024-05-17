import request from "@/utils/request.js";

// 查询车辆信息列表
export function listVehicle(query) {
    return request({
        url: 'rent/vehicle/list',
        method: 'get',
        params: query
    })
}
// 添加车辆信息
export function addVehicle(params) {
    return request({
        url: "rent/vehicle",
        method: 'post',
        data: params
    })
}