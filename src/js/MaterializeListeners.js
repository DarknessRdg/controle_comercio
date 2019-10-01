function collapsible() {
    const elems = document.querySelectorAll('.collapsible');
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

function chips() {
    const elems = document.querySelectorAll('.chips');
    M.Chips.init(elems, options);
}

function tooltips () {
    var elems = document.querySelectorAll('.tooltipped');
    var instance = M.Tooltip.init(elems, {inDuration: 100}, false, 100);
}

function select() {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
}

function date() {
    var elems = document.querySelectorAll('.datepicker');
    let now = new Date();
    M.Datepicker.init(elems, {
        format: 'dd mmmm, yyyy',
        maxDate: now,
        yearRange: 100,
        showClearBtn: true,
        i18n: {
            clear: 'Limpar',
            cancel: 'Cancelar',
            months: [
                'Janeiro',
                'Fevereiro',
                'Março',
                'Abril',
                'Maio',
                'Junho',
                'Julho',
                'Agosto',
                'Setembro',
                'Outubro',
                'Novembro',
                'Dezembro'
            ],
            monthsShort: [
                'Jan',
                'Fev',
                'Mar',
                'Abr',
                'Mai',
                'Jun',
                'Jul',
                'Ago',
                'Set',
                'Out',
                'Nov',
                'Dez'
            ],
            weekdays: [
                'Domingo',
                'Segunda',
                'Terça',
                'Quarta',
                'Quinta',
                'Sexta',
                'Sábado'
            ],
            weekdaysShort: [
                'Dom',
                'Seg',
                'Ter',
                'Qua',
                'Qui',
                'Sex',
                'Sab'
            ],
            weekdaysAbbrev: ['D','S','T','Q','Q','S','S']
        }
    });
}

module.exports = { 
    collapsible,
    tabs,
    modal,
    chips,
    tooltips,
    select,
    date
}