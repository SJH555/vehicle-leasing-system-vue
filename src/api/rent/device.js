import request from "@/utils/request.js";

export function listDevice(params) {
    return request({
        url: "rent/device/list",
        method: "get",
        params: params
    })
}

export function addDevice(params) {
    return request({
        url: "rent/device",
        method: "post",
        data: params
    })
}

export function infoDevice(id) {
    return request({
        url: `rent/device/${id}`,
        method: "get"
    })
}

export function deleteDevice(ids) {
    return request({
        url: `rent/device/${ids}`,
        method: "delete"
    })
}
