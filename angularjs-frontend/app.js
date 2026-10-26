/* AngularJS 1.x companion frontend for Event Operations Hub.
 * This is an independent demo and does not connect to the React application.
 */
(function () {
  'use strict';

  angular.module('eventOpsApp', [])
    .filter('numberFixed', function () {
      return function (value) {
        var n = Number(value || 0);
        return n < 10 ? '0' + n : String(n);
      };
    })
    .controller('DashboardController', function ($scope, $filter) {
      var vm = this;
      vm.view = 'overview';
      vm.today = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      vm.event = { name: 'Global Developer Summit', venue: 'Innovation Hall · Singapore', status: 'IN PROGRESS' };
      vm.attendeeQuery = '';
      vm.workOrders = [
        { id: 'WO-104', title: 'Verify main stage AV', area: 'Main stage', assignee: 'A. Chen', priority: 'High', status: 'In progress' },
        { id: 'WO-105', title: 'Test presenter microphones', area: 'Auditorium', assignee: 'M. Patel', priority: 'High', status: 'Pending' },
        { id: 'WO-106', title: 'Prepare registration desk', area: 'Lobby', assignee: 'S. Lee', priority: 'Medium', status: 'Verified' },
        { id: 'WO-107', title: 'Confirm breakout seating', area: 'Room B', assignee: 'J. Kim', priority: 'Low', status: 'Pending' },
        { id: 'WO-108', title: 'Check guest Wi-Fi access', area: 'All rooms', assignee: 'R. Singh', priority: 'Medium', status: 'In progress' }
      ];
      vm.attendees = [
        { id: 1, name: 'Alex Chen', initials: 'AC', company: 'Northstar Labs', role: 'Speaker', ticket: 'EVT-A102', status: 'Checked in' },
        { id: 2, name: 'Maya Patel', initials: 'MP', company: 'Cloudline', role: 'Attendee', ticket: 'EVT-A103', status: 'Registered' },
        { id: 3, name: 'Jordan Kim', initials: 'JK', company: 'Vertex Systems', role: 'VIP', ticket: 'EVT-A104', status: 'Registered' },
        { id: 4, name: 'Ravi Singh', initials: 'RS', company: 'Independent', role: 'Attendee', ticket: 'EVT-A105', status: 'Checked in' },
        { id: 5, name: 'Sam Lee', initials: 'SL', company: 'Event team', role: 'Staff', ticket: 'EVT-S001', status: 'Registered' },
        { id: 6, name: 'Nina Brooks', initials: 'NB', company: 'Brightside', role: 'Attendee', ticket: 'EVT-A106', status: 'Registered' }
      ];
      vm.rooms = [
        { code: 'RM-01', name: 'Main auditorium', note: 'Stage, microphones and projection', ready: true, readiness: 100 },
        { code: 'RM-02', name: 'Breakout room A', note: 'Seating and guest Wi-Fi', ready: true, readiness: 92 },
        { code: 'RM-03', name: 'Breakout room B', note: 'Seating count requires verification', ready: false, readiness: 74 },
        { code: 'RM-04', name: 'Registration lobby', note: 'Check-in desk and badge station', ready: true, readiness: 96 },
        { code: 'RM-05', name: 'Speaker green room', note: 'Water, signage and presentation access', ready: false, readiness: 68 },
        { code: 'RM-06', name: 'Networking lounge', note: 'Power access and furniture layout', ready: true, readiness: 90 }
      ];
      vm.incidents = [
        { id: 1, title: 'Wireless mic battery low', area: 'Main auditorium', severity: 'Medium', status: 'Open', time: '09:42' },
        { id: 2, title: 'Wayfinding sign missing', area: 'North entrance', severity: 'Low', status: 'Open', time: '09:18' }
      ];
      vm.newIncident = { title: '', area: '', severity: 'Medium' };

      vm.setView = function (view) { vm.view = view; };
      vm.viewLabel = function () {
        return ({ overview: 'DASHBOARD', work: 'TASK QUEUE', attendees: 'PEOPLE', rooms: 'VENUE STATUS', incidents: 'INCIDENT DESK' })[vm.view] || 'DASHBOARD';
      };
      vm.pageTitle = function () {
        return ({ overview: 'Operations overview', work: 'Work order queue', attendees: 'Attendee directory', rooms: 'Room readiness', incidents: 'Incident management' })[vm.view] || 'Operations overview';
      };
      vm.openWorkCount = function () { return vm.workOrders.filter(function (task) { return task.status !== 'Verified'; }).length; };
      vm.openIncidentCount = function () { return vm.incidents.filter(function (incident) { return incident.status !== 'Resolved'; }).length; };
      vm.checkedInCount = function () { return vm.attendees.filter(function (person) { return person.status === 'Checked in'; }).length; };
      vm.checkInPercent = function () { return vm.attendees.length ? Math.round(vm.checkedInCount() / vm.attendees.length * 100) : 0; };
      vm.readyRoomCount = function () { return vm.rooms.filter(function (room) { return room.ready; }).length; };
      vm.statusClass = function (status) {
        return status === 'Verified' || status === 'Resolved' || status === 'Checked in' ? 'verified' :
          status === 'In progress' ? 'in-progress' : 'pending';
      };
      vm.cycleTask = function (task) {
        var sequence = ['Pending', 'In progress', 'Verified'];
        var index = sequence.indexOf(task.status);
        task.status = sequence[(index + 1) % sequence.length];
      };
      vm.checkIn = function (person) { person.status = 'Checked in'; };
      vm.toggleRoom = function (room) {
        room.ready = !room.ready;
        room.readiness = room.ready ? Math.max(room.readiness, 90) : Math.min(room.readiness, 74);
      };
      vm.addIncident = function () {
        var title = (vm.newIncident.title || '').trim();
        var area = (vm.newIncident.area || '').trim();
        if (!title || !area) return;
        var now = new Date();
        var time = $filter('date')(now, 'HH:mm');
        vm.incidents.unshift({
          id: Date.now(),
          title: title,
          area: area,
          severity: vm.newIncident.severity || 'Medium',
          status: 'Open',
          time: time
        });
        vm.newIncident = { title: '', area: '', severity: 'Medium' };
      };
      vm.resolveIncident = function (incident) {
        incident.status = incident.status === 'Resolved' ? 'Open' : 'Resolved';
      };
      vm.resetDemo = function () {
        if (!$windowConfirm()) return;
        vm.workOrders.forEach(function (task, index) {
          task.status = ['In progress', 'Pending', 'Verified', 'Pending', 'In progress'][index];
        });
        vm.attendees.forEach(function (person, index) {
          person.status = index === 0 || index === 3 ? 'Checked in' : 'Registered';
        });
        vm.rooms.forEach(function (room, index) {
          room.ready = [true, true, false, true, false, true][index];
          room.readiness = [100, 92, 74, 96, 68, 90][index];
        });
        vm.incidents = [
          { id: 1, title: 'Wireless mic battery low', area: 'Main auditorium', severity: 'Medium', status: 'Open', time: '09:42' },
          { id: 2, title: 'Wayfinding sign missing', area: 'North entrance', severity: 'Low', status: 'Open', time: '09:18' }
        ];
        vm.view = 'overview';
        vm.attendeeQuery = '';
      };
      function $windowConfirm() {
        return window.confirm('Reset the AngularJS demo to its original sample data?');
      }
    });
}());
