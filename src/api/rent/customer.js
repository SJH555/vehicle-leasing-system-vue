import request from "@/utils/request.js"

export function listCustomer(params) {
    return request({
        url: "rent/customer/list",
        method: "get",
        params: params
    })
}