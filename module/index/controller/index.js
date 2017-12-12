class index{
    index(ctx,next){
        return `module:${ctx.module}
controller:${ctx.controller}
action:${ctx.action}`;
    }
    test(ctx,next){
        return `module:${ctx.module}
controller:${ctx.controller}
action:${ctx.action}`;
    }
}
module.exports=index;