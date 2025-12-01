// Toggle Dropdown Menu
function toggleMenu(button) {
    // Close all other open menus
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (menu !== button.nextElementSibling) {
            menu.classList.remove('show');
        }
    });
    
    // Toggle current menu
    const menu = button.nextElementSibling;
    menu.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.matches('.btn-menu')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

// Quản Lý Sân Bóng Functions
function showAddModal() {
    alert('Chức năng thêm sân bóng sẽ được triển khai');
}

function deleteField(name) {
    if (confirm(`Bạn có chắc muốn xóa sân bóng ${name}?`)) {
        alert(`Đã xóa sân bóng ${name}`);
    }
}

function editField(name) {
    const newName = prompt(`Nhập tên mới cho sân bóng ${name}:`);
    if (newName) {
        alert(`Đã đổi tên sân bóng thành: ${newName}`);
    }
}

function viewRevenue(name) {
    alert(`Xem doanh thu của sân ${name}\n\nDoanh thu tháng này: 45,000,000 VNĐ\nLượt đặt: 120 lượt`);
}

// Quản Lý Người Dùng Functions
function showAddUserModal() {
    alert('Chức năng thêm người dùng sẽ được triển khai');
}

function viewUserInfo(name) {
    alert(`Thông tin người dùng: ${name}\n\nSố điện thoại: 0901234567\nEmail: user@email.com\nĐịa chỉ: 123 Đường ABC, Quận 1\nSố lượt đặt: 15 lượt`);
}

function deleteUser(name) {
    if (confirm(`Bạn có chắc muốn xóa người dùng ${name}?`)) {
        alert(`Đã xóa người dùng ${name}`);
    }
}

// Quản Lý Nhân Viên Functions
function showAddEmployeeModal() {
    alert('Chức năng thêm nhân viên sẽ được triển khai');
}

function viewEmployeeInfo(name) {
    alert(`Thông tin nhân viên: ${name}\n\nChức vụ: Quản lý sân\nSố điện thoại: 0967890123\nEmail: employee@email.com\nNgày vào làm: 01/01/2023`);
}

function viewWorkTime(name) {
    alert(`Thời gian làm việc của ${name}\n\nCa làm: 08:00 - 17:00\nNgày làm việc: Thứ 2 - Thứ 6\nTổng giờ tháng này: 176 giờ`);
}

function viewSalary(name) {
    alert(`Mức lương của ${name}\n\nLương cơ bản: 8,000,000 VNĐ\nPhụ cấp: 1,500,000 VNĐ\nTổng lương: 9,500,000 VNĐ`);
}

function deleteEmployee(name) {
    if (confirm(`Bạn có chắc muốn xóa nhân viên ${name}?`)) {
        alert(`Đã xóa nhân viên ${name}`);
    }
}

// Quản Lý Đặt Sân Functions
function showAddBookingModal() {
    alert('Chức năng thêm đặt sân sẽ được triển khai');
}

function showBookingDetails(bookingId) {
    const modal = document.getElementById('bookingModal');
    
    // Sample data - in real app, this would come from database
    const bookingData = {
        'booking1': {
            customer: 'Nguyễn Văn An',
            phone: '0901234567',
            field: 'Sân Bóng Thiên Long',
            address: '123 Đường Nguyễn Văn A, Quận 1',
            date: '20/10/2025',
            time: '18:00 - 20:00 (2 giờ)',
            price: '400,000 VNĐ',
            status: 'Đã xác nhận'
        },
        'booking2': {
            customer: 'Trần Thị Bình',
            phone: '0912345678',
            field: 'Sân Bóng Hoàng Gia',
            address: '456 Đường Lê Văn B, Quận 2',
            date: '21/10/2025',
            time: '16:00 - 18:00 (2 giờ)',
            price: '350,000 VNĐ',
            status: 'Chờ xác nhận'
        },
        'booking3': {
            customer: 'Lê Văn Cường',
            phone: '0923456789',
            field: 'Sân Bóng Phú Thọ',
            address: '789 Đường Trần Văn C, Quận 3',
            date: '20/10/2025',
            time: '19:00 - 21:00 (2 giờ)',
            price: '450,000 VNĐ',
            status: 'Đã xác nhận'
        },
        'booking4': {
            customer: 'Phạm Thị Dung',
            phone: '0934567890',
            field: 'Sân Bóng Đại Nam',
            address: '321 Đường Phan Văn D, Quận 4',
            date: '22/10/2025',
            time: '17:00 - 19:00 (2 giờ)',
            price: '380,000 VNĐ',
            status: 'Đã xác nhận'
        },
        'booking5': {
            customer: 'Hoàng Văn Em',
            phone: '0945678901',
            field: 'Sân Bóng Hòa Bình',
            address: '654 Đường Võ Văn E, Quận 5',
            date: '19/10/2025',
            time: '18:00 - 20:00 (2 giờ)',
            price: '400,000 VNĐ',
            status: 'Đã hoàn thành'
        },
        'booking6': {
            customer: 'Vũ Thị Hoa',
            phone: '0956789012',
            field: 'Sân Bóng Thiên Long',
            address: '123 Đường Nguyễn Văn A, Quận 1',
            date: '23/10/2025',
            time: '15:00 - 17:00 (2 giờ)',
            price: '350,000 VNĐ',
            status: 'Chờ xác nhận'
        }
    };
    
    const data = bookingData[bookingId];
    if (data) {
        document.getElementById('modal-customer').textContent = data.customer;
        document.getElementById('modal-phone').textContent = data.phone;
        document.getElementById('modal-field').textContent = data.field;
        document.getElementById('modal-address').textContent = data.address;
        document.getElementById('modal-date').textContent = data.date;
        document.getElementById('modal-time').textContent = data.time;
        document.getElementById('modal-price').textContent = data.price;
        document.getElementById('modal-status').textContent = data.status;
        
        modal.classList.add('show');
    }
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('show');
}

function confirmBooking() {
    alert('Đã xác nhận đặt sân!');
    closeBookingModal();
}

function cancelBooking() {
    if (confirm('Bạn có chắc muốn hủy đặt sân này?')) {
        alert('Đã hủy đặt sân!');
        closeBookingModal();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target == modal) {
        closeBookingModal();
    }
}
