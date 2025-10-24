document.getElementById('btn-login').addEventListener('click', () => {
  const usuario = document.getElementById('usuario').value;
  document.getElementById('login').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  iniciarCalendario(usuario);
});

function iniciarCalendario(usuario) {
  const esCoordinadora = usuario === 'Mileidy';
  const listaPersonas = document.getElementById('lista-personas');
  const btnAprobar = document.getElementById('btn-aprobar');
  let eventoSeleccionado = null;

  // Colores personalizados
  const personas = {
    'Rafael': '#ffa64d',
    'Facundo': '#7CFC00',
    'Agustin': '#800080',
    'Renzo': '#C8A2C8',
    'Gustavo': '#A9A9A9',
    'Shahim': '#A9A9A9',
    'Osmany': '#A9A9A9',
    'Mileidy': '#00bfff'
  };

  // Crear lista de personas en el panel izquierdo
  listaPersonas.innerHTML = '';
  for (const nombre in personas) {
    if (esCoordinadora || nombre === usuario) {
      const div = document.createElement('div');
      div.classList.add('persona');
      div.textContent = nombre;
      div.dataset.persona = nombre;
      div.style.background = personas[nombre];
      listaPersonas.appendChild(div);
    }
  }

  // Hacer las personas arrastrables
  new FullCalendar.Draggable(listaPersonas, {
    itemSelector: '.persona',
    eventData: function(el) {
      return {
        title: el.dataset.persona,
        extendedProps: {
          persona: el.dataset.persona,
          estado: 'pendiente'
        }
      };
    }
  });

  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: [ FullCalendarDayGrid, FullCalendarInteraction ],
    initialView: 'dayGridMonth',
    firstDay: 1, // Lunes
    locale: 'es',
    droppable: true,
    editable: esCoordinadora,
    height: '100%',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],

    drop: function(info) {
      const persona = info.draggedEl.dataset.persona;

      // Solo puede crear si es el propio empleado o la coordinadora
      if (esCoordinadora || persona === usuario) {
        const tarea = prompt(`¿Qué tarea realizará ${persona}?`);
        if (tarea) {
          let color = personas[persona];

          // Si contiene la palabra "licencia", será rojo
          if (tarea.toLowerCase().includes("licencia")) {
            color = "#ff0000";
          }

          calendar.addEvent({
            title: `${tarea} - ${persona}`,
            start: info.dateStr,
            backgroundColor: color,
            extendedProps: { persona, estado: 'pendiente' },
            classNames: ['pendiente']
          });
        }
      } else {
        alert('No puedes agendar eventos para otros empleados.');
      }
    },

    eventClick: function(info) {
      eventoSeleccionado = info.event;

      // Solo Mileidy puede aprobar
      if (esCoordinadora && eventoSeleccionado.extendedProps.estado === 'pendiente') {
        btnAprobar.style.display = 'block';
      } else {
        btnAprobar.style.display = 'none';
      }
    }
  });

  calendar.render();

  // Botón para aprobar
  btnAprobar.addEventListener('click', () => {
    if (eventoSeleccionado) {
      eventoSeleccionado.setExtendedProp('estado', 'aprobado');
      eventoSeleccionado.setProp('classNames', ['aprobado']);
      eventoSeleccionado.setProp('opacity', 1);
      alert(`Evento "${eventoSeleccionado.title}" aprobado ✅`);
      btnAprobar.style.display = 'none';
    }
  });
}

