import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';

// Helper to generate a darker color from a string
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Use a lower lightness for a darker color
  const color = `hsl(${hash % 360}, 70%, 45%)`;
  return color;
}

export default function UserCalendar({ cases }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // Map cases to FullCalendar events
  const events = cases.map((c) => ({
    id: c._id,
    title: c.Case_Type || 'Case',
    start: c.Hearing_Date,
    backgroundColor: stringToColor(c.Case_Type || c._id),
    borderColor: stringToColor(c.Case_Type || c._id),
    extendedProps: c,
  }));

  function handleEventClick(info) {
    setSelectedCase(info.event.extendedProps);
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
    setSelectedCase(null);
  }

  return (
    <div className="my-4">
      <h2 className="mb-2 text-xl font-bold text-center dark:text-white">Your Case Calendar</h2>
      <div className="max-w-2xl mx-auto rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 p-2">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          height={350}
          eventDisplay="block"
          headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
        />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Case Details"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(30, 41, 59, 0.55)', // dark overlay
            zIndex: 1000,
          },
          content: {
            maxWidth: '350px',
            minHeight: 'auto',
            maxHeight: '350px',
            margin: 'auto',
            borderRadius: '1rem',
            padding: '1.2rem',
            background: 'rgba(255,255,255,0.97)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            border: 'none',
            color: '#1e293b',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          },
        }}
      >
        {selectedCase && (
          <div className="space-y-2">
            <h3 className="mb-2 text-xl font-semibold text-blue-700 dark:text-blue-400">{selectedCase.Case_Type}</h3>
            <p><b>Date:</b> {selectedCase.Hearing_Date}</p>
            <p><b>Lawyer:</b> {selectedCase.Lawyer_Name}</p>
            <p><b>Address:</b> {selectedCase.Address}</p>
            <p><b>City:</b> {selectedCase.City}</p>
            <p><b>Court Type:</b> {selectedCase.Court_Type}</p>
            <p><b>Description:</b> {selectedCase.Case_desciption}</p>
            <button onClick={closeModal} className="px-4 py-2 mt-4 bg-blue-700 hover:bg-blue-800 text-white rounded shadow">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
