import request from "@/utils/request.js"

export function listCustomer(params) {
    return request({
        url: "rent/customer/list",
        method: "get",
        params: params
    })
}

export function addCustomer(params) {
    return request({
        url: "rent/customer",
        method: "post",
        data: params
    })
}

export function infoCustomer(id) {
    return request({
        url: `rent/customer/${id}`,
        method: "get",
    })
}

export function updateCustomer(params) {
    return request({
        url: "rent/customer",
        method: "put",
        data: params
    })
}

export function deleteCustomer(ids) {
    return request({
        url: `rent/customer/${ids}`,
        method: "delete",
    })
}