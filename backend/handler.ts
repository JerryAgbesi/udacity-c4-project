"use strict";

module.exports.hello = async(event) => {
    return{
        statusCode:200,
        body : JSON.stringify(
            {
                message:"Go serverless!!, your function executed!!",
                input:event,

            },null,
            2
        ),
    };
};