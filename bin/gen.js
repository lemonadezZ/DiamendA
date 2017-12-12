const p=require('process');
class gen{
    constructor(argv){
        var option="";
        switch(argv[2]){
            case "-h":
                this.help();
            break;
            case "-v":
                this.version();
            break;
            default: 
            break;
        }
    }
    test(){
        return "success";
    }
    version(){
        console.log("v 0.0.1");
    }
    help(){
        console.log("帮助文件");
    }
}

if (require.main === module) {
    var g=new gen(p.argv);
}
module.exports=gen;