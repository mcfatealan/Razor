var inputdata = [
      {number: '1', name: '张三', sex: '男', score: '99', comment: ' '},
      {number: '2', name: '李四', sex: '男', score: '79', comment: '希望分到六班'},
      {number: '3', name: '小梅', sex: '女', score: '89', comment: '个性较强'},
    ];

var outputdata =[];

var
    container_input = document.getElementById('table_input'),
    table_input;
  
  table_input = new Handsontable(container_input, {
    data: inputdata,
    dataSchema: {number: null, name: null, sex: null, score: null, comment: null},
    startRows: 5,
    startCols: 4,
    colHeaders: ['编号', '姓名', '性别', '分数', '备注'],
    columns: [
      {data: 'number'},
      {data: 'name'},
      {data: 'sex'},
      {data: 'score'},
      {data: 'comment'},
    ],
    minSpareRows: 1
  });


var
    container_output = document.getElementById('table_output'),
    table_output;
  
  table_output = new Handsontable(container_output, {
    data: outputdata,
    dataSchema: {number: null, name: null, sex: null, score: null, comment: null, group: null},
    startRows: 6,
    startCols: 6,
    colHeaders: ['编号', '姓名', '性别', '分数', '备注', '班级'],
    columns: [
      {data: 'number'},
      {data: 'name'},
      {data: 'sex'},
      {data: 'score'},
      {data: 'comment'},
      {data: 'group'},
    ],
    minSpareRows: 1
  });



new Vue({
    el: '#app',
    data: {
        group_num_string: null,
        group_num: null,
        studentPool: {'malePool':[],'femalePool':[]},
        groups:[],

        staticsMessage: ''
    },
    methods: {
        passTest: function () {
            //group number should be a positive integer
            this.group_num = Number(this.group_num_string);
            if(isNaN(this.group_num) || this.group_num<=0)
            {
                alert('输入的分班数量不合法，请重新检查后输入');
                return false;
            }

            for(student in inputdata)
            {
                //skip last empty row
                if(student==inputdata.length-1) continue;
                
                var newStudent = {
                    'id': student,
                    'score': 0,
                    'info': inputdata[student],
                };
                
                
                newStudent.score = Number(inputdata[student].score);
                if(isNaN(newStudent.score) || inputdata[student].score=='')
                {
                    var alertText='';
                    alertText += '第'+(parseInt(student)+1).toString()+'行数据出错:\n';
                    alertText += JSON.stringify(inputdata[student])+'\n';
                    alertText += '出错原因： 分数必须合理';
                    alert(alertText);
                    return false;
                }

                if(inputdata[student].sex=='男')
                    this.studentPool.malePool.push(newStudent);
                else if(inputdata[student].sex=='女')
                    this.studentPool.femalePool.push(newStudent);
                else
                {
                    var alertText='';
                    alertText += '第'+(parseInt(student)+1).toString()+'行数据出错:\n';
                    alertText += JSON.stringify(inputdata[student])+'\n';
                    alertText += '出错原因： 性别只能是男或女';
                    alert(alertText);
                    return false;
                }
    
            }

            return true;
        },
        subgroupAlgo: function (pool,sex) {
            pool.sort(function(a, b){
                var keyA = a.score,
                    keyB = b.score;
                if(keyA > keyB) return -1;
                if(keyA < keyB) return 1;
                return 0;
            });
    
            while(pool.length>0)
            {
                var theStudent;
                
                var remainGroups = Array.apply(null, Array(this.group_num)).map(function (_, i) {return i;});
                while(remainGroups.length>0)
                {
                    if(pool.length==0)
                        break;

                    theStudent = pool[0];

                    var randomIndex = Math.floor(Math.random() * remainGroups.length);
                    var groupID = remainGroups[randomIndex];
                    console.log(randomIndex);
                    console.log(groupID);
                    this.groups[groupID].pool.push(theStudent);
                    if(sex)
                        this.groups[groupID].maleCount += 1;
                    else
                        this.groups[groupID].femaleCount += 1;

                    this.groups[groupID].max = Math.max(this.groups[groupID].max, theStudent.score);
                    this.groups[groupID].min = Math.min(this.groups[groupID].min, theStudent.score);
                    this.groups[groupID].totalScore += theStudent.score;
                    
                    remainGroups.splice(randomIndex, 1);
                    pool.splice(0, 1);
                }
            }

        },

        groupAlgo: function () {
            for(var groupIndex=0; groupIndex<this.group_num;groupIndex++)
            {
                this.groups.push({
                    'pool': [],
                    'maleCount': 0,
                    'femaleCount': 0,
                    'max': -99999,
                    'min': 99999,
                    'totalScore': 0,
                });
            }

            this.subgroupAlgo(this.studentPool.malePool,true);
            this.subgroupAlgo(this.studentPool.femalePool,false);

            outputdata = [];
            for(var groupIndex=0; groupIndex<this.group_num;groupIndex++)
            {
                var grouppool = this.groups[groupIndex].pool;
                for(elem in grouppool)
                {
                    var info = grouppool[elem].info;
                    info.group = groupIndex+1;
                    outputdata.push(info);
                }
            }
            
            table_output.loadData(outputdata);
        },
        printStatics: function (ifsuccess) {
            if(!ifsuccess)
            {
                this.message = '失败';
                this.staticsMessage = '输入错误，生成失败';
            }
            else
            {
                this.message = '成功';
                this.staticsMessage = '';
                for(var groupIndex=0; groupIndex<this.group_num;groupIndex++)
                {

                    this.staticsMessage += '第'+(Number(groupIndex)+1).toString()+'班情况:<br />';
                    this.staticsMessage += '&nbsp; 男女人数:'+ this.groups[groupIndex].maleCount+':'+this.groups[groupIndex].femaleCount+' <br />';
                    this.staticsMessage += '&nbsp; 最高分:'+this.groups[groupIndex].max+' <br />';
                    this.staticsMessage += '&nbsp; 最低分:'+this.groups[groupIndex].min+' <br />';
                    this.staticsMessage += '&nbsp; 平均分:'+this.groups[groupIndex].totalScore/(this.groups[groupIndex].maleCount+this.groups[groupIndex].femaleCount)+'<br />';
                    this.staticsMessage += '<br />';
                }
            }            
        },
        init: function () {
            this.studentPool = {'malePool':[],'femalePool':[]};
            this.groups = [];

            this.staticsMessage = '';

        },

        main: function () {
            this.init();

            if(this.passTest())
            {
                this.groupAlgo();
                this.printStatics(true);
            }
            else
                this.printStatics(false);

        }
    }
})

