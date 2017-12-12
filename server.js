const koa= require('koa');
const send = require('koa-send');
const websocket=require('socket.io');
//默认加载首页
const index= require('./module/index/controller/index');
//加载配置文件
const config= require('./config');

const app=new koa();

app.use(async(ctx, next) => {
    if (ctx.request.path == '/') {
        //首页缓存
        ctx.module="index";
        ctx.controller="index;"
        ctx.action="index";
        ctx.body=(new index).index(ctx,next);
        await next();
    } else {
        //html页面缓存
        //开发关闭缓存
        var url_path=ctx.request.path;
        var url_split=ctx.request.path.split(".");
        var path= url_split[0];
        var ext= url_split[1]||null;
        var paths=path.split('/');
        ctx.module=paths[1]=paths[1]||"index";
        if(paths[1]=="static"){
            console.log("发送静态文件");
            console.log(ctx.path);
            await send(ctx, ctx.path,{root:__dirname+"/public"});
            return ;
        }
        ctx.controller=paths[2]=paths[2]||"index";
        ctx.action=paths[3]=paths[3]||"index";
        console.log("ext:"+ext);
        var module_path=`./module/${paths[1]}/controller/${paths[2]}`;
        var m=require(module_path);
        var c=new m();
        var a=paths[3];
        ctx.body=c[a](ctx, next);
        await next();   
    }
});

const io=new websocket();
io.on("connection",function(socket){
    var room=socket.handshake.query.r;
    //加入聊天室
    socket.join(room);
    socket.to(room).on('chat message', function(msg){
        console.log("room:"+room);
        console.log("message:"+msg);
        io.to(room).emit('chat message',socket.id+msg);
    });

   

    socket.to(room).on('level message', function(msg){
        console.log("room:"+room);
        console.log("message:"+msg);
        io.to(room).emit('chat message',socket.id+msg);
    });
    

    socket.on("disconnect",function(msg){
        console.log("断开连接")
        var room=socket.handshake.query.r;
        io.to(room).emit('chat message',socket.id+"离开房间");
    })
   
})


setInterval(()=>{
    io.to('http://localhost:3000/static/test.html?111222').emit('chat message',"系统广播"+(new Date) );
},5000)

io.listen(3001);

app.listen(config.port,()=>{
    console.log("listen:"+config.port);
});
