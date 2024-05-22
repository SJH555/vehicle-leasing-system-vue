import request from "@/utils/request.js";

// 查询车辆类型信息列表
export function listVehicleType(query) {
    return request({
        url: 'rent/vehicle/type/list',
        method: 'get',
        params: query
    })
}
// 添加车辆类型信息
export function addVehicleType(params) {
    return request({
        url: 'rent/vehicle/type',
        method: 'post',
        data: params
    })
}
// 更新车辆类型信息
export function updateVehicleType(params) {
    return request({
        url: 'rent/vehicle/type',
        method: 'put',
        data: params
    })
}
// 删除车辆类型信息
export function delVehicleType(id) {
    return request({
        url: 'rent/vehicle/type/' + id,
        method: 'delete'
    })
}
// 获取指定车辆信息
export function infoVehicleType(id) {
    return request({
        url: `rent/vehicle/type/${id}`,
        method: "get"
    })
}