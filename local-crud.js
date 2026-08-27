/**
 * Local Storage CRUD Operations Library
 * Real frontend functionality for ePay CRM
 * Replaces toast-only placeholders with actual working forms and data storage
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) {
    console.log(message);
    alert(message);
    return;
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
  toast.innerHTML = `<i class="fas ${icon}" style="margin-right:8px;"></i> ${message}`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = '0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
}

function closeModal(modalId) {
  if (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  } else {
    // Close any active modal
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) {
      activeModal.classList.remove('active');
      setTimeout(() => activeModal.style.display = 'none', 300);
    }
  }
}

function generateId(prefix = 'ID') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getCurrentUser() {
  const profile = JSON.parse(sessionStorage.getItem('epay-profile') || '{}');
  return {
    uid: profile.userId || 'demo-user',
    email: profile.email || 'demo@epay.com',
    role: profile.role || 'user',
    name: profile.name || 'Demo User'
  };
}

function getStorageKey(collection) {
  return `epay-crm-${collection}`;
}

function saveToStorage(collection, data) {
  try {
    localStorage.setItem(getStorageKey(collection), JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    showToast('Error saving data: ' + error.message, 'error');
    return false;
  }
}

function getFromStorage(collection) {
  try {
    const data = localStorage.getItem(getStorageKey(collection));
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

// ============================================================================
// MODAL CREATION FUNCTIONS
// ============================================================================

function createEmployeeModal() {
  const modalHTML = `
    <div id="addEmployeeModal" class="modal-overlay">
      <div class="modal-box">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <h2 style="margin:0;">Add Employee</h2>
          <button onclick="closeModal('addEmployeeModal')" style="background:none;border:none;font-size:24px;cursor:pointer;color:#666;">&times;</button>
        </div>
        <form id="employeeForm" onsubmit="submitEmployeeForm(event)">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
            <div><label>Name *</label><input type="text" name="name" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Email *</label><input type="email" name="email" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Mobile *</label><input type="tel" name="mobile" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Designation</label><input type="text" name="designation" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Department</label><input type="text" name="department" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Branch</label><input type="text" name="branch" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Team</label><input type="text" name="team" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Joining Date</label><input type="date" name="joiningDate" value="${new Date().toISOString().split('T')[0]}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
          </div>
          <div style="margin-top:20px;display:flex;gap:10px;justify-content:flex-end;">
            <button type="button" onclick="closeModal('addEmployeeModal')" class="btn" style="padding:10px 20px;">Cancel</button>
            <button type="submit" class="btn btn-primary" style="padding:10px 20px;">Add Employee</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  if (!document.getElementById('addEmployeeModal')) {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
}

function createLeadModal() {
  const modalHTML = `
    <div id="addLeadModal" class="modal-overlay">
      <div class="modal-box">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <h2 style="margin:0;">Add Lead</h2>
          <button onclick="closeModal('addLeadModal')" style="background:none;border:none;font-size:24px;cursor:pointer;color:#666;">&times;</button>
        </div>
        <form id="leadForm" onsubmit="submitLeadForm(event)">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
            <div><label>Name *</label><input type="text" name="name" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Mobile *</label><input type="tel" name="mobile" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Email</label><input type="email" name="email" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Source</label><input type="text" name="source" value="Manual" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Campaign</label><input type="text" name="campaign" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div>
              <label>Lead Type</label>
              <select name="leadType" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;">
                <option value="hot">Hot</option>
                <option value="warm" selected>Warm</option>
                <option value="cold">Cold</option>
              </select>
            </div>
            <div>
              <label>Priority</label>
              <select name="priority" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;">
                <option value="high">High</option>
                <option value="medium" selected>Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div><label>Score</label><input type="number" name="score" value="50" min="0" max="100" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
          </div>
          <div style="margin-top:15px;">
            <label>Notes</label>
            <textarea name="notes" rows="3" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></textarea>
          </div>
          <div style="margin-top:20px;display:flex;gap:10px;justify-content:flex-end;">
            <button type="button" onclick="closeModal('addLeadModal')" class="btn" style="padding:10px 20px;">Cancel</button>
            <button type="submit" class="btn btn-primary" style="padding:10px 20px;">Add Lead</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  if (!document.getElementById('addLeadModal')) {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
}

function createTaskModal() {
  const modalHTML = `
    <div id="addTaskModal" class="modal-overlay">
      <div class="modal-box">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <h2 style="margin:0;">Create Task</h2>
          <button onclick="closeModal('addTaskModal')" style="background:none;border:none;font-size:24px;cursor:pointer;color:#666;">&times;</button>
        </div>
        <form id="taskForm" onsubmit="submitTaskForm(event)">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
            <div style="grid-column:1/-1;"><label>Title *</label><input type="text" name="title" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div style="grid-column:1/-1;"><label>Description</label><textarea name="description" rows="3" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></textarea></div>
            <div><label>Assigned To</label><input type="text" name="assignedTo" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Due Date</label><input type="date" name="dueDate" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div>
              <label>Priority</label>
              <select name="priority" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;">
                <option value="high">High</option>
                <option value="medium" selected>Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div><label>Category</label><input type="text" name="category" value="General" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
          </div>
          <div style="margin-top:20px;display:flex;gap:10px;justify-content:flex-end;">
            <button type="button" onclick="closeModal('addTaskModal')" class="btn" style="padding:10px 20px;">Cancel</button>
            <button type="submit" class="btn btn-primary" style="padding:10px 20px;">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  if (!document.getElementById('addTaskModal')) {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
}

function createBranchModal() {
  const modalHTML = `
    <div id="addBranchModal" class="modal-overlay">
      <div class="modal-box">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <h2 style="margin:0;">Add Branch</h2>
          <button onclick="closeModal('addBranchModal')" style="background:none;border:none;font-size:24px;cursor:pointer;color:#666;">&times;</button>
        </div>
        <form id="branchForm" onsubmit="submitBranchForm(event)">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
            <div><label>Branch Name *</label><input type="text" name="name" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Branch Code *</label><input type="text" name="branchCode" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>City</label><input type="text" name="city" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>State</label><input type="text" name="state" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div style="grid-column:1/-1;"><label>Address</label><input type="text" name="address" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Phone</label><input type="tel" name="phone" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Email</label><input type="email" name="email" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
          </div>
          <div style="margin-top:20px;display:flex;gap:10px;justify-content:flex-end;">
            <button type="button" onclick="closeModal('addBranchModal')" class="btn" style="padding:10px 20px;">Cancel</button>
            <button type="submit" class="btn btn-primary" style="padding:10px 20px;">Add Branch</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  if (!document.getElementById('addBranchModal')) {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
}

function createUserModal() {
  const modalHTML = `
    <div id="addUserModal" class="modal-overlay">
      <div class="modal-box">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <h2 style="margin:0;">Add User</h2>
          <button onclick="closeModal('addUserModal')" style="background:none;border:none;font-size:24px;cursor:pointer;color:#666;">&times;</button>
        </div>
        <form id="userForm" onsubmit="submitUserForm(event)">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
            <div><label>Name *</label><input type="text" name="name" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Email *</label><input type="email" name="email" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Mobile</label><input type="tel" name="mobile" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Role</label><input type="text" name="role" value="user" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Department</label><input type="text" name="department" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
            <div><label>Branch</label><input type="text" name="branch" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;"></div>
          </div>
          <div style="margin-top:20px;display:flex;gap:10px;justify-content:flex-end;">
            <button type="button" onclick="closeModal('addUserModal')" class="btn" style="padding:10px 20px;">Cancel</button>
            <button type="submit" class="btn btn-primary" style="padding:10px 20px;">Add User</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  if (!document.getElementById('addUserModal')) {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
}

// ============================================================================
// FORM SUBMISSION HANDLERS
// ============================================================================

function submitEmployeeForm(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const currentUser = getCurrentUser();
  
  const employee = {
    id: generateId('EMP'),
    empId: generateId('EMP'),
    name: formData.get('name'),
    email: formData.get('email'),
    mobile: formData.get('mobile'),
    designation: formData.get('designation') || '',
    department: formData.get('department') || '',
    team: formData.get('team') || '',
    branch: formData.get('branch') || '',
    joiningDate: formData.get('joiningDate') || new Date().toISOString().split('T')[0],
    status: 'active',
    createdBy: currentUser.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const employees = getFromStorage('employees');
  employees.push(employee);
  
  if (saveToStorage('employees', employees)) {
    showToast(`Employee ${employee.name} added successfully! ID: ${employee.empId}`, 'success');
    closeModal('addEmployeeModal');
    event.target.reset();
    
    // Refresh table if function exists
    if (typeof loadEmployees === 'function') {
      loadEmployees();
    }
  }
}

function submitLeadForm(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const currentUser = getCurrentUser();
  
  const lead = {
    id: generateId('LEAD'),
    leadId: generateId('LEAD'),
    name: formData.get('name'),
    mobile: formData.get('mobile'),
    email: formData.get('email') || '',
    source: formData.get('source') || 'Manual',
    campaign: formData.get('campaign') || '',
    leadType: formData.get('leadType') || 'warm',
    priority: formData.get('priority') || 'medium',
    score: parseInt(formData.get('score')) || 50,
    status: 'new',
    stage: 'prospecting',
    notes: formData.get('notes') || '',
    assignedTo: currentUser.name,
    createdBy: currentUser.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const leads = getFromStorage('leads');
  leads.push(lead);
  
  if (saveToStorage('leads', leads)) {
    showToast(`Lead ${lead.name} added successfully! ID: ${lead.leadId}`, 'success');
    closeModal('addLeadModal');
    event.target.reset();
    
    if (typeof loadLeads === 'function') {
      loadLeads();
    }
  }
}

function submitTaskForm(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const currentUser = getCurrentUser();
  
  const task = {
    id: generateId('TASK'),
    taskId: generateId('TASK'),
    title: formData.get('title'),
    description: formData.get('description') || '',
    assignedTo: formData.get('assignedTo') || '',
    dueDate: formData.get('dueDate') || '',
    priority: formData.get('priority') || 'medium',
    category: formData.get('category') || 'General',
    status: 'pending',
    createdBy: currentUser.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const tasks = getFromStorage('tasks');
  tasks.push(task);
  
  if (saveToStorage('tasks', tasks)) {
    showToast(`Task created successfully! ID: ${task.taskId}`, 'success');
    closeModal('addTaskModal');
    event.target.reset();
    
    if (typeof loadTasks === 'function') {
      loadTasks();
    }
  }
}

function submitBranchForm(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const currentUser = getCurrentUser();
  
  const branch = {
    id: generateId('BRANCH'),
    branchId: generateId('BRANCH'),
    name: formData.get('name'),
    branchCode: formData.get('branchCode'),
    city: formData.get('city') || '',
    state: formData.get('state') || '',
    address: formData.get('address') || '',
    phone: formData.get('phone') || '',
    email: formData.get('email') || '',
    status: 'active',
    createdBy: currentUser.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const branches = getFromStorage('branches');
  branches.push(branch);
  
  if (saveToStorage('branches', branches)) {
    showToast(`Branch ${branch.name} added successfully! Code: ${branch.branchCode}`, 'success');
    closeModal('addBranchModal');
    event.target.reset();
    
    if (typeof loadBranches === 'function') {
      loadBranches();
    }
  }
}

function submitUserForm(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const currentUser = getCurrentUser();
  
  const user = {
    id: generateId('USER'),
    userId: generateId('USER'),
    name: formData.get('name'),
    email: formData.get('email'),
    mobile: formData.get('mobile') || '',
    role: formData.get('role') || 'user',
    department: formData.get('department') || '',
    branch: formData.get('branch') || '',
    status: 'active',
    createdBy: currentUser.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const users = getFromStorage('users');
  users.push(user);
  
  if (saveToStorage('users', users)) {
    showToast(`User ${user.name} added successfully! ID: ${user.userId}`, 'success');
    closeModal('addUserModal');
    event.target.reset();
    
    if (typeof loadUsers === 'function') {
      loadUsers();
    }
  }
}

// ============================================================================
// BUTTON CLICK HANDLERS (Replace toast-only calls)
// ============================================================================

function openAddEmployeeModal() {
  createEmployeeModal();
  showModal('addEmployeeModal');
}

function openAddLeadModal() {
  createLeadModal();
  showModal('addLeadModal');
}

function openAddTaskModal() {
  createTaskModal();
  showModal('addTaskModal');
}

function openAddBranchModal() {
  createBranchModal();
  showModal('addBranchModal');
}

function openAddUserModal() {
  createUserModal();
  showModal('addUserModal');
}

// Edit functions
function editRecord(collection, id) {
  showToast(`Edit ${collection} feature coming soon (ID: ${id})`, 'info');
  // TODO: Implement edit modal with pre-filled data
}

// Delete functions
function deleteRecord(collection, id) {
  if (!confirm(`Are you sure you want to delete this ${collection}?`)) return;
  
  const records = getFromStorage(collection);
  const filtered = records.filter(item => item.id !== id && item[collection + 'Id'] !== id);
  
  if (saveToStorage(collection, filtered)) {
    showToast(`${collection} deleted successfully!`, 'success');
    
    // Refresh appropriate list
    const loaderName = `load${collection.charAt(0).toUpperCase() + collection.slice(1)}`;
    if (typeof window[loaderName] === 'function') {
      window[loaderName]();
    }
  }
}

// ============================================================================
// INITIALIZE ON PAGE LOAD
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
  // Add close modal on backdrop click
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal();
    }
  });
  
  // Add ESC key to close modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
});

// Export functions globally
window.openAddEmployeeModal = openAddEmployeeModal;
window.openAddLeadModal = openAddLeadModal;
window.openAddTaskModal = openAddTaskModal;
window.openAddBranchModal = openAddBranchModal;
window.openAddUserModal = openAddUserModal;
window.submitEmployeeForm = submitEmployeeForm;
window.submitLeadForm = submitLeadForm;
window.submitTaskForm = submitTaskForm;
window.submitBranchForm = submitBranchForm;
window.submitUserForm = submitUserForm;
window.editRecord = editRecord;
window.deleteRecord = deleteRecord;
window.closeModal = closeModal;
window.showModal = showModal;
