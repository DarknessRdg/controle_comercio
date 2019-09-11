function collapsible() {
    var elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems, 'click');
}

function tabs() {
    const elems = document.querySelectorAll('.tabs')
    M.Tabs.init(elems, 'click')
}

function modal() {
    const elems = document.querySelectorAll('.modal')
    M.Modal.init(elems, {});
}


module.exports = { 
    collapsible,
    tabs,
    modal
}