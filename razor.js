new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue.js!',
        csv_file_content: ''
    },
    methods: {
    groupMethod: function () {
        var csvContent = 'xx';
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my_data.csv");
        document.body.appendChild(link); // Required for FF

        link.click();
    }
  }
})
