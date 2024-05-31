import request from "@/utils/request.js"

export function listLease(params) {
    return request({
        url: 'rent/lease/list',
        method: 'get',
        params: params
    })
}