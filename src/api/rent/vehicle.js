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
// 获取指定车辆信息
export function getVehicle(id) {
    return request({
        url: `rent/vehicle/${id}`,
        method: 'get',
    })
}
// 更新车辆信息
export function editVehicle(params) {
    return request({
        url: "rent/vehicle",
        method: "put",
        data: params
    })
}
// 删除车辆信息
export function deleteVehicle(ids) {
    return request({
        url: `rent/vehicle/${ids}`,
        method: "delete",
    })
}