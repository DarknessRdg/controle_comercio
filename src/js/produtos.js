document.addEventListener('DOMContentLoaded', function() {    
    const elems = document.querySelectorAll('.tabs');
    const instance = M.Tabs.init(elems, 'click');
});


const produtosOnDatabase = []
document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.autocomplete');
    const instances = M.Autocomplete.init(elems, {
        data: {
            "Apple": null,
            "Microsoft": null,
            "Google": 'https://i.stack.imgur.com/Hgqq8.png'
          },
    });
});