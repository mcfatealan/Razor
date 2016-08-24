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
        studentPool: []
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
                    'sex': true,
                    'score': 0,
                    'info': inputdata[student],
                };
                
                if(inputdata[student].sex=='男')
                    newStudent.sex = true;
                else if(inputdata[student].sex=='女')
                    newStudent.sex = false;
                else
                {
                    var alertText='';
                    alertText += '第'+(parseInt(student)+1).toString()+'行数据出错:\n';
                    alertText += JSON.stringify(inputdata[student])+'\n';
                    alertText += '出错原因： 性别只能是男或女';
                    alert(alertText);
                    return false;
                }

                newStudent.score = Number(inputdata[student].score);
                if(isNaN(newStudent.score))
                {
                    var alertText='';
                    alertText += '第'+(parseInt(student)+1).toString()+'行数据出错:\n';
                    alertText += JSON.stringify(inputdata[student])+'\n';
                    alertText += '出错原因： 分数必须合理';
                    alert(alertText);
                    return false;
                }
    
                studentPool.append(newStudent);
            }

            return true;
        },
        groupAlgo: function () {
            outputdata = JSON.parse(JSON.stringify(inputdata));
            table_output.loadData(outputdata);
        },
        main: function () {
            if(this.passTest())
                this.groupAlgo();
        }
    }
})

