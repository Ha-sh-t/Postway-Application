import winston from "winston";

const logger = winston.createLogger({
    level:'info',
    format:winston.format.json(),
    defaultMeta:{service:'request-logging'},
    transports:[
        new winston.transports.File({filename:'log.txt'})
    ]
})

const loggerMiddleWare = async (req , res , next)=>{
    console.log("logger called")
    //log data
    const logData = `${req.url} , req-body:${JSON.stringify(req.body)}`;
    if(!req.url.includes('sign')){
        logger.info(logData)
    }

    next();
}
export default loggerMiddleWare;