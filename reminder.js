document.addEventListener('DOMContentLoaded', function() {
    const reminderForm = document.getElementById('reminderForm');
    const reminderList = document.getElementById('reminderList');
    const notificationSound = document.getElementById('notificationSound');
  
    // Function to set reminders
    reminderForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const title = this.title.value.trim();
      const description = this.description.value.trim();
      const date = this.date.value;
      const time = this.time.value;
  
      if (!title || !description || !date || !time) {
        alert('Please fill in all fields.');
        return;
      }
  
      if (title.length > 12 || description.length > 32) {
        alert('Title must be maximum 12 characters and description maximum 32 characters.');
        return;
      }
  
      const reminder = {
        title,
        description,
        date,
        time
      };
  
      saveReminder(reminder);
      displayReminder(reminder);
      this.reset();
    });
  
    // Function to save reminder to localStorage
    function saveReminder(reminder) {
      let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
      reminders.push(reminder);
      localStorage.setItem('reminders', JSON.stringify(reminders));
    }
  
    // Function to display reminders
    function displayReminder(reminder) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <p><strong>Title:</strong> ${reminder.title}</p>
        <p><strong>Description:</strong> ${reminder.description}</p>
        <p><strong>Date:</strong> ${reminder.date}</p>
        <p><strong>Time:</strong> ${reminder.time}</p>
        <button class="removeBtn">Remove</button>
      `;
      reminderList.appendChild(card);
  
      const removeButton = card.querySelector('.removeBtn');
      removeButton.addEventListener('click', function() {
        card.remove();
        removeReminder(reminder);
      });
    }
  
    // Function to remove reminder from localStorage
    function removeReminder(reminder) {
      let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
      reminders = reminders.filter(r => JSON.stringify(r) !== JSON.stringify(reminder));
      localStorage.setItem('reminders', JSON.stringify(reminders));
    }
  
    // Function to check reminders at regular intervals
    function checkReminders() {
      setInterval(() => {
        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        const currentTime = new Date();
        reminders.forEach(reminder => {
          const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
          if (currentTime >= reminderTime) {
            notificationSound.play(); // Play the notification sound
            alert(`Reminder: ${reminder.title} - ${reminder.description}`);
            removeReminder(reminder);
            displayReminders();
          }
        });
      }, 1000); // Check every second
    }
  
    // Function to display all reminders
    function displayReminders() {
      reminderList.innerHTML = '';
      const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
      reminders.forEach(reminder => {
        displayReminder(reminder);
      });
    }
  
    // Check reminders on page load
    checkReminders();
    // Display existing reminders on page load
    displayReminders();
});
  