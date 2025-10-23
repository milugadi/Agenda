document.getElementById('btn-login').addEventListener('click', () => {
  const usuario = document.getElementById('usuario').value;
  document.getElementById('login').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  iniciarCalendario(usuario);
});

function iniciarCalendario(usuario) {
  const esCoordinadora = usuario === 'coordinadora';
  const listaPersonas = document.getElementById('lista-personas');
  const btnAprobar = document.getElementById('btn-aprobar');
  let eventoSeleccionado = null;

  // Colores de personas
  const personas = {
    'Mickey': '#33ccff',
    'Gabriela': '#ff66b2',
    'Juan': '#ffa500'
  };

  // Crear lista de personas (draggables)
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

  // Eventos iniciales de ejemplo
  const eventos = [
    { title: 'Teletrabajo - Mickey', start: '2025-10-02', backgroundColor: personas['Mickey'], extendedProps: { persona: 'Mickey', estado: 'aprobado' }, classNames: ['aprobado'] },
    { title: 'Licencia - Gabriela', start: '2025-10-10', backgroundColor: personas['Gabriela'], extendedProps: { persona: 'Gabriela', estado: 'pendiente' }, classNames: ['pendiente'] },
    { title: 'Viaje - Juan', start: '2025-10-20', backgroundColor: personas['Juan'], extendedProps: { persona: 'Juan', estado: 'aprobado' }, classNames: ['aprobado'] },
  ];

  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: [ FullCalendarInteraction ],
    initialView: 'dayGridMonth',
    droppable: true, // permite soltar personas
    editable: esCoordinadora, // solo coordinadora puede mover eventos
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: eventos,

    drop: function(info) {
      const persona = info.draggedEl.dataset.persona;

      // Solo puede crear si es el propio empleado o la coordinadora
      if (esCoordinadora || persona === usuario) {
        const nota = prompt('Escribe una nota o motivo para el evento:');
        if (nota) {
          const color = personas[persona];
          calendar.addEvent({
            title: `${nota} - ${persona}`,
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

      // Mostrar botón de aprobación solo si es coordinadora y pendiente
      if (esCoordinadora && eventoSeleccionado.extendedProps.estado === 'pendiente') {
        btnAprobar.style.display = 'block';
      } else {
        btnAprobar.style.display = 'none';
      }
    }
  });

  calendar.render();

  // Botón para aprobar evento
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
