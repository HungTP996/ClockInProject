
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Punch, PunchType, Leave, UserProfile, WorkIncident, IncidentType } from './types';

// --- i1n Translations ---
const translations = {
  vi: {
    timeSheetTitle: 'Bảng Chấm Công',
    userProfileTitle: 'Hồ sơ người dùng',
    nameLabel: 'Tên',
    employeeIdLabel: 'Mã nhân viên',
    passwordLabel: 'Mật khẩu',
    languageLabel: 'Ngôn ngữ',
    clockIn: 'Bắt đầu',
    clockOut: 'Kết thúc',
    clockedInStatus: 'Đã bắt đầu làm việc',
    notClockedInStatus: 'Chưa bắt đầu làm việc',
    clockedOut: 'Đã kết thúc',
    lastPunchPrefix: 'Lần cuối:',
    atTime: 'lúc',
    todayLogTitle: "Nhật ký hôm nay",
    noActivityYet: 'Chưa có hoạt động nào.',
    reminderTitle: 'Nhắc nhở',
    incompleteDayWarning: 'Bạn có ngày làm việc chưa đủ 8 tiếng. Vui lòng kiểm tra lại bảng chấm công.',
    calendarHeaderFormat: { month: 'long', year: 'numeric' },
    weekdays: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    onLeave: 'Nghỉ',
    dayDetailModalTitleFormat: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    onLeaveRequest: 'Đã xin nghỉ:',
    reasonLabel: 'Lý do:',
    dailyActivity: 'Hoạt động trong ngày:',
    noPunchActivity: 'Không có hoạt động chấm công.',
    requestLeave: 'Xin nghỉ phép',
    newVacationRequest: 'New Vacation Request',
    leaveMode: 'Hình thức nghỉ',
    singleDayLeave: 'Nghỉ một ngày',
    multiDayLeave: 'Nghỉ nhiều ngày',
    leaveType: 'Tên kỳ nghỉ',
    required: '(Bắt buộc)',
    pleaseSelect: 'Vui lòng chọn',
    dateOfLeave: 'Ngày nghỉ',
    startDate: 'Ngày bắt đầu',
    endDate: 'Ngày kết thúc',
    leaveDuration: 'Độ dài kỳ nghỉ',
    leaveReason: 'Lý do nghỉ',
    leaveReasonHint: '(Bắt buộc. Chế độ bắt buộc do quản trị viên chọn.)',
    confirmButton: 'Gửi yêu cầu',
    startDateAfterEndDateError: 'Ngày bắt đầu không thể sau ngày kết thúc.',
    selectLeaveCategoryError: 'Vui lòng chọn Tên kỳ nghỉ.',
    days: 'ngày',
    day: 'ngày',
    byHour: 'Theo giờ',
    fullDay: 'Cả ngày',
    workStatistics: 'Thống kê công việc',
    thisMonth: 'Tháng này',
    thisWeek: 'Tuần này',
    totalHours: 'Tổng giờ làm',
    workDays: 'Số ngày làm',
    leaveDays: 'Số ngày nghỉ',
    avgHoursPerDay: 'Giờ TB/ngày',
    loginTitle: 'Đăng nhập Chấm công',
    loginButton: 'Đăng nhập',
    logoutButton: 'Đăng xuất',
    adminMode: 'Chế độ Admin',
    leaveStatus: 'Trạng thái',
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
    approve: 'Duyệt',
    reject: 'Từ chối',
    requester: 'Người yêu cầu',
    loginFailed: 'Mã nhân viên hoặc mật khẩu không đúng.',
    loginContactAdmin: 'Nếu bạn không thể đăng nhập, vui lòng liên hệ quản trị viên để được cấp lại thông tin.',
    userManagement: 'Quản lý người dùng',
    addNewUser: 'Thêm người dùng mới',
    roleLabel: 'Vai trò',
    userRole: 'Nhân viên',
    adminRole: 'Quản trị viên',
    save: 'Lưu',
    edit: 'Sửa',
    delete: 'Xóa',
    cancel: 'Hủy',
    addUser: 'Thêm',
    confirmDeleteUser: 'Bạn có chắc muốn xóa người dùng này?',
    employeeIdExists: 'Mã nhân viên đã tồn tại.',
    adminDashboardTitle: 'Bảng điều khiển trạng thái nhân viên',
    workingHours: 'Giờ làm việc',
    startTime: 'Giờ bắt đầu',
    backToDashboard: 'Quay lại Bảng điều khiển',
    noOtherUsers: 'Không có nhân viên nào khác để hiển thị.',
    filterBy: 'Lọc theo',
    sortBy: 'Sắp xếp theo',
    status: 'Trạng thái',
    all: 'Tất cả',
    active: 'Đang làm việc',
    inactive: 'Không làm việc',
    onLeaveFilter: 'Đang nghỉ',
    sortName: 'Tên',
    sortStatus: 'Trạng thái',
    sortHours: 'Giờ làm việc',
    passwordStrength: {
      title: 'Độ mạnh mật khẩu',
      weak: 'Yếu',
      medium: 'Trung bình',
      strong: 'Mạnh',
      veryStrong: 'Rất mạnh',
    },
    passwordSuggestions: {
      minLength: 'Ít nhất 8 ký tự',
      lowercase: 'Bao gồm chữ thường (a-z)',
      uppercase: 'Bao gồm chữ hoa (A-Z)',
      number: 'Bao gồm số (0-9)',
      symbol: 'Bao gồm ký tự đặc biệt (!@#$%)',
    },
    leaveApprovalsTitle: 'Duyệt đơn nghỉ phép',
    pendingLeaveNotification: '{name} có {count} đơn xin nghỉ đang chờ duyệt.',
    missedClockOut: 'Quên checkout',
    missedClockOutNotificationTitle: 'Yêu cầu chú ý',
    missedClockOutNotificationText: 'Bạn có {count} ngày quên chấm công kết thúc. Vui lòng sửa lại.',
    correctTime: 'Sửa thời gian',
    correctionRequestTitle: 'Yêu cầu sửa giờ về',
    correctionForDate: 'Sửa cho ngày {date}',
    requestedClockOutTime: 'Giờ về yêu cầu',
    correctionApprovalsTitle: 'Duyệt đơn sửa giờ',
    pendingCorrectionNotification: '{name} yêu cầu sửa giờ về cho ngày {date} lúc {time}.',
    viewLog: 'Xem Nhật ký',
    userActivityLogTitle: 'Nhật ký Hoạt động Người dùng',
    leaveTypes: {
      paid_leave_1_day: 'Paid leave (1 day)',
      paid_leave_0_5_day_am: 'Paid leave (0.5 day AM)',
      paid_leave_0_5_day_pm: 'Paid leave (0.5 day PM)',
      unpaid_leave_1_day: 'Unpaid leave (1 day)',
      unpaid_leave_by_hour: 'Unpaid leave (by the hour)',
      unpaid_leave_0_5_day_am: 'Unpaid leave (0.5 day AM)',
      unpaid_leave_0_5_day_pm: 'Unpaid leave (0.5 day PM)',
      bereavement_marriage_leave: 'Bereavement/Marriage leave',
      social_insurance_leave_full_day: 'Social insurance leave (full day)',
      marriage_leave_full_day: 'Nghỉ kết hôn(Nghỉ cả ngày)',
      maternity_leave_full_day: 'Nghỉ thai sản(Nghỉ cả ngày)',
      child_marriage_leave_full_day: 'Nghỉ con cưới(Nghỉ cả ngày)',
    },
    weather: {
      title: 'Thời tiết hôm nay',
      loading: 'Đang tải thời tiết...',
      permissionDenied: 'Truy cập vị trí bị từ chối. Vui lòng bật trong cài đặt trình duyệt.',
      notSupported: 'Trình duyệt của bạn không hỗ trợ định vị.',
      fetchError: 'Không thể tải dữ liệu thời tiết.',
      rainWarning: 'Chiều nay có thể mưa đó, bạn mang dù đi chưa? ☔️',
      uvWarning: 'Nay nắng và tia cực tím đó, nhớ thoa kem chống nắng nha! ☀️',
      niceDay: 'Chúc bạn một ngày tốt lành! ✨',
      today: 'Hôm nay',
      hourly: 'Hàng giờ',
      daily: '7 ngày tới',
      feelsLike: 'Cảm giác như',
      humidity: 'Độ ẩm',
      windSpeed: 'Gió'
    },
    workAnniversary: {
      thankYouMessage: 'Cảm ơn {name} đã làm việc tại công ty được:',
      daysUnit: 'ngày'
    }
  },
  en: {
    timeSheetTitle: 'Time Sheet',
    userProfileTitle: 'User Profile',
    nameLabel: 'Name',
    employeeIdLabel: 'Employee ID',
    passwordLabel: 'Password',
    languageLabel: 'Language',
    clockIn: 'Clock In',
    clockOut: 'Clock Out',
    clockedInStatus: 'Clocked In',
    notClockedInStatus: 'Not Clocked In',
    clockedOut: 'Clocked Out',
    lastPunchPrefix: 'Last:',
    atTime: 'at',
    todayLogTitle: "Today's Log",
    noActivityYet: 'No activity yet.',
    reminderTitle: 'Reminder',
    incompleteDayWarning: 'You have working days with less than 8 hours. Please check your timesheet.',
    calendarHeaderFormat: { month: 'long', year: 'numeric' },
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    onLeave: 'Leave',
    dayDetailModalTitleFormat: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    onLeaveRequest: 'On Leave:',
    reasonLabel: 'Reason:',
    dailyActivity: 'Activities of the day:',
    noPunchActivity: 'No clocking activity.',
    requestLeave: 'Request Leave',
    newVacationRequest: 'New Vacation Request',
    leaveMode: 'Leave Mode',
    singleDayLeave: 'Single Day',
    multiDayLeave: 'Multi-Day',
    leaveType: 'Leave Type',
    required: '(Required)',
    pleaseSelect: 'Please select',
    dateOfLeave: 'Date of leave',
    startDate: 'Start date',
    endDate: 'End date',
    leaveDuration: 'Leave duration',
    leaveReason: 'Reason for leave',
    leaveReasonHint: '(Required. Mode set by administrator.)',
    confirmButton: 'Submit Request',
    startDateAfterEndDateError: 'Start date cannot be after end date.',
    selectLeaveCategoryError: 'Please select a leave type.',
    days: 'days',
    day: 'day',
    byHour: 'By the hour',
    fullDay: 'Full day',
    workStatistics: 'Work Statistics',
    thisMonth: 'This Month',
    thisWeek: 'This Week',
    totalHours: 'Total Hours',
    workDays: 'Work Days',
    leaveDays: 'Leave Days',
    avgHoursPerDay: 'Avg Hours/Day',
    loginTitle: 'Time Clock Login',
    loginButton: 'Login',
    logoutButton: 'Logout',
    adminMode: 'Admin Mode',
    leaveStatus: 'Status',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    approve: 'Approve',
    reject: 'Reject',
    requester: 'Requester',
    loginFailed: 'Invalid Employee ID or Password.',
    loginContactAdmin: 'If you are unable to log in, please contact an administrator for assistance.',
    userManagement: 'User Management',
    addNewUser: 'Add New User',
    roleLabel: 'Role',
    userRole: 'User',
    adminRole: 'Admin',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    addUser: 'Add',
    confirmDeleteUser: 'Are you sure you want to delete this user?',
    employeeIdExists: 'Employee ID already exists.',
    adminDashboardTitle: 'Employee Status Dashboard',
    workingHours: 'Working Hours',
    startTime: 'Start Time',
    backToDashboard: 'Back to Dashboard',
    noOtherUsers: 'No other users to display.',
    filterBy: 'Filter by',
    sortBy: 'Sort by',
    status: 'Status',
    all: 'All',
    active: 'Active',
    inactive: 'Inactive',
    onLeaveFilter: 'On Leave',
    sortName: 'Name',
    sortStatus: 'Status',
    sortHours: 'Hours Worked',
    passwordStrength: {
      title: 'Password Strength',
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong',
      veryStrong: 'Very Strong',
    },
    passwordSuggestions: {
      minLength: 'At least 8 characters',
      lowercase: 'Include lowercase letters (a-z)',
      uppercase: 'Include uppercase letters (A-Z)',
      number: 'Include numbers (0-9)',
      symbol: 'Include special characters (!@#$%)',
    },
    leaveApprovalsTitle: 'Leave Approvals',
    pendingLeaveNotification: '{name} has {count} pending leave request(s).',
    missedClockOut: 'Missed C/O',
    missedClockOutNotificationTitle: 'Attention Required',
    missedClockOutNotificationText: 'You have {count} day(s) with a missed clock-out. Please correct them.',
    correctTime: 'Correct Time',
    correctionRequestTitle: 'Clock-Out Correction Request',
    correctionForDate: 'Correction for {date}',
    requestedClockOutTime: 'Requested Clock-Out Time',
    correctionApprovalsTitle: 'Correction Approvals',
    pendingCorrectionNotification: '{name} requests a clock-out correction for {date} at {time}.',
    viewLog: 'View Log',
    userActivityLogTitle: 'User Activity Log',
    leaveTypes: {
      paid_leave_1_day: 'Paid leave (1 day)',
      paid_leave_0_5_day_am: 'Paid leave (0.5 day AM)',
      paid_leave_0_5_day_pm: 'Paid leave (0.5 day PM)',
      unpaid_leave_1_day: 'Unpaid leave (1 day)',
      unpaid_leave_by_hour: 'Unpaid leave (by the hour)',
      unpaid_leave_0_5_day_am: 'Unpaid leave (0.5 day AM)',
      unpaid_leave_0_5_day_pm: 'Unpaid leave (0.5 day PM)',
      bereavement_marriage_leave: 'Bereavement/Marriage leave',
      social_insurance_leave_full_day: 'Social insurance leave (full day)',
      marriage_leave_full_day: 'Marriage leave (full day)',
      maternity_leave_full_day: 'Maternity leave (full day)',
      child_marriage_leave_full_day: 'Child marriage leave (full day)',
    },
    weather: {
      title: "Today's Weather",
      loading: 'Fetching weather...',
      permissionDenied: 'Location access denied. Please enable it in your browser settings.',
      notSupported: 'Geolocation is not supported by your browser.',
      fetchError: 'Could not fetch weather data.',
      rainWarning: "Looks like it might rain later! Did you bring an umbrella? ☔️",
      uvWarning: "It's sunny out there with strong UV rays! Don't forget your sunscreen! ☀️",
      niceDay: "Wishing you a wonderful day! ✨",
      today: 'Today',
      hourly: 'Hourly',
      daily: '7-Day',
      feelsLike: 'Feels Like',
      humidity: 'Humidity',
      windSpeed: 'Wind'
    },
    workAnniversary: {
      thankYouMessage: 'Thank you {name} for being with the company for:',
      daysUnit: 'days'
    }
  },
  ja: {
    timeSheetTitle: 'タイムシート',
    userProfileTitle: 'ユーザープロフィール',
    nameLabel: '名前',
    employeeIdLabel: '従業員ID',
    passwordLabel: 'パスワード',
    languageLabel: '言語',
    clockIn: '出勤',
    clockOut: '退勤',
    clockedInStatus: '勤務中',
    notClockedInStatus: '未出勤',
    clockedOut: '退勤済み',
    lastPunchPrefix: '最終:',
    atTime: '',
    todayLogTitle: "本日のログ",
    noActivityYet: 'アクティビティはありません。',
    reminderTitle: 'リマインダー',
    incompleteDayWarning: '8時間未満の勤務日があります。タイムシートを確認してください。',
    calendarHeaderFormat: { year: 'numeric', month: 'long' },
    weekdays: ['月', '火', '水', '木', '金', '土', '日'],
    onLeave: '休暇',
    dayDetailModalTitleFormat: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    onLeaveRequest: '休暇申請済み:',
    reasonLabel: '理由:',
    dailyActivity: '本日のアクティビティ:',
    noPunchActivity: '打刻アクティビティがありません。',
    requestLeave: '休暇申請',
    newVacationRequest: '新規休暇申請',
    leaveMode: '休暇モード',
    singleDayLeave: '1日休暇',
    multiDayLeave: '複数日休暇',
    leaveType: '休暇タイプ',
    required: '(必須)',
    pleaseSelect: '選択してください',
    dateOfLeave: '休暇日',
    startDate: '開始日',
    endDate: '終了日',
    leaveDuration: '休暇期間',
    leaveReason: '休暇理由',
    leaveReasonHint: '(必須。管理者が設定したモードです。)',
    confirmButton: 'リクエストを送信',
    startDateAfterEndDateError: '開始日は終了日より後に設定できません。',
    selectLeaveCategoryError: '休暇タイプを選択してください。',
    days: '日間',
    day: '日',
    byHour: '時間単位',
    fullDay: '終日',
    workStatistics: '勤務統計',
    thisMonth: '今月',
    thisWeek: '今週',
    totalHours: '合計時間',
    workDays: '勤務日数',
    leaveDays: '休暇日数',
    avgHoursPerDay: '平均/日',
    loginTitle: 'タイムクロックログイン',
    loginButton: 'ログイン',
    logoutButton: 'ログアウト',
    adminMode: '管理者モード',
    leaveStatus: 'ステータス',
    pending: '保留中',
    approved: '承認済み',
    rejected: '拒否されました',
    approve: '承認',
    reject: '拒否',
    requester: '申請者',
    loginFailed: '従業員IDまたはパスワードが無効です。',
    loginContactAdmin: 'ログインできない場合は、管理者に連絡してサポートを依頼してください。',
    userManagement: 'ユーザー管理',
    addNewUser: '新規ユーザー追加',
    roleLabel: '役割',
    userRole: 'ユーザー',
    adminRole: '管理者',
    save: '保存',
    edit: '編集',
    delete: '削除',
    cancel: 'キャンセル',
    addUser: '追加',
    confirmDeleteUser: 'このユーザーを削除してもよろしいですか？',
    employeeIdExists: 'この従業員IDはすでに存在します。',
    adminDashboardTitle: '従業員ステータスダッシュボード',
    workingHours: '勤務時間',
    startTime: '開始時間',
    backToDashboard: 'ダッシュボードに戻る',
    noOtherUsers: '表示する他のユーザーはいません。',
    filterBy: 'フィルター',
    sortBy: '並び替え',
    status: 'ステータス',
    all: 'すべて',
    active: '勤務中',
    inactive: '未勤務',
    onLeaveFilter: '休暇中',
    sortName: '名前',
    sortStatus: 'ステータス',
    sortHours: '勤務時間',
    passwordStrength: {
      title: 'パスワードの強度',
      weak: '弱い',
      medium: '普通',
      strong: '強い',
      veryStrong: '非常に強い',
    },
    passwordSuggestions: {
      minLength: '8文字以上',
      lowercase: '小文字 (a-z) を含める',
      uppercase: '大文字 (A-Z) を含める',
      number: '数字 (0-9) を含める',
      symbol: '特殊文字 (!@#$%) を含める',
    },
    leaveApprovalsTitle: '休暇申請の承認',
    pendingLeaveNotification: '{name}さんには{count}件の保留中の休暇申請があります。',
    missedClockOut: '退勤忘れ',
    missedClockOutNotificationTitle: '対応が必要です',
    missedClockOutNotificationText: '退勤打刻を忘れた日が{count}日あります。修正してください。',
    correctTime: '時刻を修正',
    correctionRequestTitle: '退勤時刻の修正申請',
    correctionForDate: '{date}の修正',
    requestedClockOutTime: '希望退勤時刻',
    correctionApprovalsTitle: '修正申請の承認',
    pendingCorrectionNotification: '{name}さんが{date}の退勤時刻を{time}に修正するよう申請しています。',
    viewLog: 'ログ表示',
    userActivityLogTitle: 'ユーザーアクティビティログ',
    leaveTypes: {
      paid_leave_1_day: '有給休暇 (1日)',
      paid_leave_0_5_day_am: '有給休暇 (午前半休)',
      paid_leave_0_5_day_pm: '有給休暇 (午後半休)',
      unpaid_leave_1_day: '無給休暇 (1日)',
      unpaid_leave_by_hour: '無給休暇 (時間単位)',
      unpaid_leave_0_5_day_am: '無給休暇 (午前半休)',
      unpaid_leave_0_5_day_pm: '無給休暇 (午後半休)',
      bereavement_marriage_leave: '慶弔休暇',
      social_insurance_leave_full_day: '社会保険休暇 (終日)',
      marriage_leave_full_day: '結婚休暇 (終日)',
      maternity_leave_full_day: '産休 (終日)',
      child_marriage_leave_full_day: '子の結婚休暇 (終日)',
    },
    weather: {
      title: '今日の天気',
      loading: '天気を取得中...',
      permissionDenied: '位置情報へのアクセスが拒否されました。ブラウザの設定で有効にしてください。',
      notSupported: 'お使いのブラウザは地理位置情報に対応していません。',
      fetchError: '天気データを取得できませんでした。',
      rainWarning: '後で雨が降るかもしれません！傘は持っていますか？☔️',
      uvWarning: '外は晴れていて紫外線が強いです！日焼け止めを忘れずに！☀️',
      niceDay: '素敵な一日をお過ごしください！✨',
      today: '今日',
      hourly: '時間別',
      daily: '7日間',
      feelsLike: '体感温度',
      humidity: '湿度',
      windSpeed: '風速'
    },
    workAnniversary: {
      thankYouMessage: '{name}さん、いつもお疲れ様です。勤務日数は:',
      daysUnit: '日'
    }
  }
};

type Language = 'vi' | 'en' | 'ja';

// --- Helper Functions ---

const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const calculateWorkHours = (punches: Punch[]): number => {
  if (!punches || punches.length === 0) return 0;
  let totalMilliseconds = 0;
  const sortedPunches = [...punches]
    .map(p => ({ ...p, time: new Date(p.time) }))
    .sort((a, b) => a.time.getTime() - b.time.getTime());

  let clockInTime: number | null = null;
  for (const punch of sortedPunches) {
      if (punch.type === PunchType.ClockIn && clockInTime === null) {
          clockInTime = punch.time.getTime();
      } else if (punch.type === PunchType.ClockOut && clockInTime !== null) {
          totalMilliseconds += punch.time.getTime() - clockInTime;
          clockInTime = null;
      }
  }

  return totalMilliseconds / (1000 * 60 * 60);
};

// --- SVG Icons ---
const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const ClockInIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const ClockOutIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const AlertTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>);
const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>);
const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>);
const CalendarPlusIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM12 14v4m-2-2h4" /></svg>);
const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>);
const UserIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const LoginIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>);
const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);
const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const BellIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>);
const LogIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);
const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const ThermometerIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M15 13.5a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M10.5 3v10.35a3.5 3.5 0 103 0V3a1.5 1.5 0 00-3 0z" /></svg>);
const DropletIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C7.58 0 4 3.58 4 8c0 2.21 1.79 4 4 4 .28 0 .5-.22.5-.5S8.28 11 8 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3c0 .28.22.5.5.5s.5-.22.5-.5c0-2.21-1.79-4-4-4zm6 6c0 2.21-1.79 4-4 4-.28 0-.5-.22-.5-.5s.22-.5.5-.5c1.66 0 3-1.34 3-3s-1.34-3-3-3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5c2.21 0 4 1.79 4 4zm-6 8c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" /></svg>);
const WindIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" /></svg>);
const AwardIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 22 12 17 17 22 15.79 13.88"></polyline></svg>);
const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>);


// --- Password Strength Helper ---
const checkPasswordStrength = (password: string) => {
    let score = 0;
    const suggestions: string[] = [];

    if (password.length >= 8) {
        score++;
    } else {
        suggestions.push('minLength');
    }
    if (/[a-z]/.test(password)) {
        score++;
    } else {
        suggestions.push('lowercase');
    }
    if (/[A-Z]/.test(password)) {
        score++;
    } else {
        suggestions.push('uppercase');
    }
    if (/\d]/.test(password)) {
        score++;
    } else {
        suggestions.push('number');
    }
    if (/[^a-zA-Z0-9]/.test(password)) {
        score++;
    } else {
        suggestions.push('symbol');
    }
    
    let strengthLevel = 0;
    if (password.length > 0) {
        if (score <= 2) strengthLevel = 1;      // Weak
        else if (score === 3) strengthLevel = 2; // Medium
        else if (score === 4) strengthLevel = 3; // Strong
        else if (score === 5) strengthLevel = 4; // Very Strong
    }
    return { strengthLevel, suggestions };
};

const PasswordStrengthMeter: React.FC<{ password?: string; t: (key: string, options?: { [key: string]: string | number }) => any; }> = ({ password = '', t }) => {
    const { strengthLevel, suggestions } = checkPasswordStrength(password);
    if (!password) return null;

    const strengthLabels = [t('passwordStrength.weak'), t('passwordStrength.medium'), t('passwordStrength.strong'), t('passwordStrength.veryStrong')];
    const strengthColors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

    return (
        <div className="mt-2 w-full">
            <div className="flex justify-between items-center mb-1">
                 <p className="text-sm font-medium text-slate-600">{t('passwordStrength.title')}</p>
                 <span className={`text-sm font-bold ${['text-red-600', 'text-orange-500', 'text-yellow-600', 'text-green-600'][strengthLevel - 1] || 'text-slate-600'}`}>
                    {strengthLabels[strengthLevel - 1] || ''}
                 </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${strengthColors[strengthLevel - 1] || 'bg-transparent'}`}
                    style={{ width: `${strengthLevel * 25}%` }}
                ></div>
            </div>
            {suggestions.length > 0 && strengthLevel < 4 && (
                <ul className="text-xs text-slate-500 mt-2 space-y-1">
                    {suggestions.map(suggestionKey => (
                         <li key={suggestionKey} className="flex items-center">
                            <svg className="w-3 h-3 mr-1.5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                            {t(`passwordSuggestions.${suggestionKey}`)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// --- Helper Components ---
const Clock: React.FC<{ language: Language }> = ({ language }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const locale = language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'vi-VN';
  const formattedTime = time.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const formattedDate = time.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="text-center text-slate-800">
      <h1 className="text-6xl md:text-8xl font-mono font-bold tracking-widest">{formattedTime}</h1>
      <p className="mt-2 text-lg md:text-xl text-slate-500">{formattedDate}</p>
    </div>
  );
};
const StatusDisplay: React.FC<{ isClockedIn: boolean; lastPunch?: Punch; t: (key: string) => any; language: Language }> = ({ isClockedIn, lastPunch, t, language }) => {
  const locale = language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'vi-VN';
  return (
    <div className="text-center my-6 p-4 rounded-lg bg-slate-100 w-full max-w-sm">
      <div className="flex items-center justify-center gap-3">
        <span className={`h-4 w-4 rounded-full ${isClockedIn ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
        <p className="text-xl font-semibold text-slate-800">
          {isClockedIn ? t('clockedInStatus') : t('notClockedInStatus')}
        </p>
      </div>
      {lastPunch && (
        <p className="text-sm text-slate-500 mt-2">
          {t('lastPunchPrefix')} {t(lastPunch.type)} {t('atTime')} {new Date(lastPunch.time).toLocaleTimeString(locale)}
        </p>
      )}
    </div>
  );
};
const TimeLog: React.FC<{ punches: Punch[]; t: (key: string) => any; language: Language }> = ({ punches, t, language }) => {
    const locale = language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'vi-VN';
  return (
    <div className="w-full bg-white rounded-lg p-4 md:p-6 mt-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-700 border-b pb-2 mb-4 flex items-center gap-2">
        <ClockIcon className="h-6 w-6 text-slate-500" />
        {t('todayLogTitle')}
      </h3>
      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
        {punches.length > 0 ? (
          [...punches].reverse().map((punch, index) => (
            <div key={index} className={`flex justify-between items-center p-3 rounded-md ${punch.type === PunchType.ClockIn ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <span className="font-semibold">{t(punch.type)}</span>
              <span className="font-mono text-sm">{new Date(punch.time).toLocaleTimeString(locale)}</span>
            </div>
          ))
        ) : (
          <p className="text-slate-500 text-center py-4">{t('noActivityYet')}</p>
        )}
      </div>
    </div>
  );
};
const Reminder: React.FC<{ allPunches: { [key: string]: Punch[] }; t: (key: string) => any; }> = ({ allPunches, t }) => {
    const incompleteDays = useMemo(() => {
        const todayKey = formatDateKey(new Date());
        return Object.keys(allPunches).filter(dateKey => {
            if (dateKey >= todayKey) return false;
            const day = new Date(dateKey);
            day.setHours(12);
            const dayOfWeek = day.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) return false;
            
            const hours = calculateWorkHours(allPunches[dateKey]);
            return hours > 0 && hours < 8;
        });
    }, [allPunches]);

    if (incompleteDays.length === 0) return null;

    return (
        <div className="w-full bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-6 rounded-r-lg" role="alert">
            <div className="flex">
                <div className="py-1"><AlertTriangleIcon className="h-6 w-6 text-yellow-500 mr-4"/></div>
                <div>
                    <p className="font-bold">{t('reminderTitle')}</p>
                    <p className="text-sm">{t('incompleteDayWarning')}</p>
                </div>
            </div>
        </div>
    );
};
const Calendar: React.FC<{
    currentMonth: Date;
    allPunches: { [key: string]: Punch[] };
    leavesByDate: { [key: string]: Leave };
    incidentsByDate: { [key: string]: WorkIncident };
    onMonthChange: (direction: 'prev' | 'next') => void;
    onDayClick: (date: Date) => void;
    t: (key: string) => any;
    language: Language;
}> = ({ currentMonth, allPunches, leavesByDate, incidentsByDate, onMonthChange, onDayClick, t, language }) => {
    const locale = language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'vi-VN';
    
    const renderHeader = () => (
        <div className="flex justify-between items-center mb-4">
            <button onClick={() => onMonthChange('prev')} className="p-2 rounded-full hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300 transition-colors">
                <ChevronLeftIcon className="h-6 w-6 text-slate-600"/>
            </button>
            <h4 className="text-xl font-bold text-slate-800">
                {currentMonth.toLocaleString(locale, t('calendarHeaderFormat') as Intl.DateTimeFormatOptions)}
            </h4>
            <button onClick={() => onMonthChange('next')} className="p-2 rounded-full hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300 transition-colors">
                <ChevronRightIcon className="h-6 w-6 text-slate-600"/>
            </button>
        </div>
    );
    const renderDays = () => {
        const days = translations[language].weekdays;
        return (
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-sm text-slate-500">
                {days.map(day => <div key={day} className="p-2">{day}</div>)}
            </div>
        );
    };
    const renderCells = () => {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const dayOfWeekStart = monthStart.getDay();
        const diff = (dayOfWeekStart === 0) ? 6 : dayOfWeekStart - 1;
        const startDate = new Date(monthStart);
        startDate.setDate(startDate.getDate() - diff);
        
        const rows = [];
        let day = new Date(startDate);
        
        for(let w=0; w < 6; w++) {
            const weekDays = [];
            for (let i = 0; i < 7; i++) {
                const dayCopy = new Date(day);
                const dateKey = formatDateKey(dayCopy);
                const dayPunches = allPunches[dateKey] || [];
                const hours = calculateWorkHours(dayPunches);
                const dayOfWeek = dayCopy.getDay();
                const leaveInfo = leavesByDate[dateKey];
                const incidentInfo = incidentsByDate[dateKey];
                
                let cellClass = 'p-2 h-16 flex flex-col justify-start items-start rounded-lg text-sm transition-all duration-200 cursor-pointer border-2 border-transparent ';
                if (dayCopy.getMonth() !== currentMonth.getMonth()) {
                    cellClass += 'text-slate-300 bg-slate-50';
                } else if (incidentInfo) {
                    cellClass += 'bg-orange-100 text-orange-800 border-orange-300 font-bold';
                } else if (leaveInfo) {
                    if (leaveInfo.status === 'approved') cellClass += 'bg-blue-100 text-blue-800 border-blue-300 font-bold';
                    else if (leaveInfo.status === 'pending') cellClass += 'bg-yellow-100 text-yellow-800 border-yellow-300 font-bold';
                    else if (leaveInfo.status === 'rejected') cellClass += 'bg-red-200 text-red-800 border-red-400 font-bold line-through';
                } else if (dayOfWeek === 0 || dayOfWeek === 6) {
                    cellClass += 'bg-slate-100 text-slate-500';
                } else if (hours >= 8) {
                    cellClass += 'bg-green-100 text-green-800 border-green-300 font-bold';
                } else if (hours > 0 && hours < 8) {
                    cellClass += 'bg-red-100 text-red-800 border-red-300 font-bold';
                } else {
                    cellClass += 'bg-white hover:bg-sky-100 hover:border-sky-300';
                }
                 if (formatDateKey(dayCopy) === formatDateKey(new Date())) {
                    cellClass += ' ring-2 ring-sky-500';
                }

                weekDays.push(
                    <div key={day.toString()} className={cellClass} onClick={() => onDayClick(dayCopy)}>
                        <span className="font-medium">{dayCopy.getDate()}</span>
                         {incidentInfo && dayCopy.getMonth() === currentMonth.getMonth() && (
                            <span className="text-xs mt-auto self-end font-bold">{t('missedClockOut')}</span>
                         )}
                         {dayCopy.getMonth() === currentMonth.getMonth() && !leaveInfo && !incidentInfo && hours > 0 && (dayOfWeek !== 0 && dayOfWeek !== 6) && (
                            <span className="text-xs mt-auto self-end font-mono">{hours.toFixed(1)}h</span>
                         )}
                         {leaveInfo && dayCopy.getMonth() === currentMonth.getMonth() && !incidentInfo && (
                            <span className="text-xs mt-auto self-end font-bold">{t('onLeave') as string}</span>
                         )}
                    </div>
                );
                day.setDate(day.getDate() + 1);
            }
            rows.push(<div key={`week-${w}`} className="grid grid-cols-7 gap-2">{weekDays}</div>);
        }
        return <div className="space-y-2">{rows}</div>;
    };

    return (
        <div className="w-full bg-white rounded-lg p-4 md:p-6 mt-6 border border-slate-200">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
};

// --- Modals ---
const DayDetailModal: React.FC<{
    date: Date;
    punches: Punch[];
    leave: Leave | undefined;
    incident: WorkIncident | undefined;
    onClose: () => void;
    onRequestLeave: () => void;
    onCorrectTime: () => void;
    onLeaveStatusChange: (leave: Leave, newStatus: 'approved' | 'rejected') => void;
    t: (key: string) => any;
    language: Language;
    isAdminView: boolean;
    isImpersonating: boolean;
}> = ({ date, punches, leave, incident, onClose, onRequestLeave, onCorrectTime, onLeaveStatusChange, t, language, isAdminView, isImpersonating }) => {
    const locale = language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'vi-VN';
    const leaveTypeName = leave ? translations[language].leaveTypes[leave.leaveType as keyof typeof translations[Language]['leaveTypes']] || leave.leaveType : '';
    const statusColor = leave?.status === 'approved' ? 'bg-blue-100 text-blue-800' : leave?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-700">
                    <CloseIcon className="h-6 w-6"/>
                </button>
                <h3 className="text-xl font-bold text-slate-800 mb-4">{date.toLocaleDateString(locale, t('dayDetailModalTitleFormat') as Intl.DateTimeFormatOptions)}</h3>
                
                {incident && (
                     <div className="bg-orange-100 text-orange-800 p-3 rounded-md mb-4">
                        <p className="font-bold">{t('missedClockOut')}</p>
                        <p className="text-sm mt-1">{t(`status`)}: {t(incident.status)}</p>
                    </div>
                )}
                {leave && (
                    <div className={`${statusColor} p-3 rounded-md mb-4`}>
                        <p><span className="font-bold">{t('leaveStatus')}:</span> <span className="font-semibold">{t(leave.status)}</span></p>
                        {isAdminView && <p className="text-sm mt-1"><span className="font-bold">{t('requester')}:</span> {leave.name} ({leave.employeeId})</p>}
                        <p className="font-bold mt-2">{t('onLeaveRequest')} <span className="font-normal">{leaveTypeName}</span></p>
                        <p className="text-sm mt-1">{t('reasonLabel')} {leave.reason}</p>
                    </div>
                )}
                <div className="border-t pt-4">
                    <h4 className="font-semibold text-slate-600 mb-2">{t('dailyActivity')}</h4>
                    {punches.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {punches.map((punch, index) => (
                                <div key={index} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                                    <span className={`font-semibold ${punch.type === PunchType.ClockIn ? 'text-green-600' : 'text-red-600'}`}>{t(punch.type)}</span>
                                    <span className="font-mono">{new Date(punch.time).toLocaleTimeString(locale)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm">{t('noPunchActivity')}</p>
                    )}
                </div>
                {!leave && !isAdminView && !isImpersonating && incident && incident.status === 'pending_correction' && (
                     <div className="mt-6 border-t pt-4">
                        <button onClick={onCorrectTime} className="w-full flex items-center justify-center bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                            <ClockIcon className="h-6 w-6 mr-2"/>
                            {t('correctTime')}
                        </button>
                    </div>
                )}
                {!leave && !isAdminView && !isImpersonating && !incident && (
                    <div className="mt-6 border-t pt-4">
                        <button onClick={onRequestLeave} className="w-full flex items-center justify-center bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 transition-colors">
                            <CalendarPlusIcon className="h-6 w-6 mr-2"/>
                            {t('requestLeave')}
                        </button>
                    </div>
                )}
                 {leave && isAdminView && leave.status === 'pending' && (
                    <div className="mt-6 border-t pt-4 flex gap-4">
                        <button onClick={() => onLeaveStatusChange(leave, 'approved')} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">{t('approve')}</button>
                        <button onClick={() => onLeaveStatusChange(leave, 'rejected')} className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors">{t('reject')}</button>
                    </div>
                 )}
            </div>
        </div>
    );
};
const LeaveRequestModal: React.FC<{
    initialDate: Date;
    onClose: () => void;
    onSubmit: (startDate: Date, endDate: Date | null, leaveType: string, reason: string) => void;
    t: (key: string) => any;
    language: Language;
}> = ({ initialDate, onClose, onSubmit, t, language }) => {
    const [leaveMode, setLeaveMode] = useState<'single' | 'multi'>('single');
    const [leaveCategory, setLeaveCategory] = useState('');
    const [leaveDate, setLeaveDate] = useState(formatDateKey(initialDate));
    const [leaveEndDate, setLeaveEndDate] = useState(formatDateKey(initialDate));
    const [reason, setReason] = useState('');

    const leaveOptions = useMemo(() => {
        const types = translations[language].leaveTypes;
        return Object.keys(types).map(key => ({
            key,
            label: types[key as keyof typeof types]
        }));
    }, [language]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!leaveCategory) {
            alert(t('selectLeaveCategoryError'));
            return;
        }
        const startDate = new Date(leaveDate + 'T00:00:00');
        const endDate = leaveMode === 'multi' ? new Date(leaveEndDate + 'T00:00:00') : null;

        if (endDate && startDate > endDate) {
            alert(t('startDateAfterEndDateError'));
            return;
        }
        onSubmit(startDate, endDate, leaveCategory, reason);
    };
    const leaveDuration = useMemo(() => {
        if (leaveMode === 'multi') {
            const start = new Date(leaveDate);
            const end = new Date(leaveEndDate);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                return `${diffDays} ${diffDays > 1 ? t('days') : t('day')}`;
            }
            return '-';
        }
        
        const selectedOption = leaveOptions.find(opt => opt.key === leaveCategory);
        if (!selectedOption) return '-';
        const label = selectedOption.label.toLowerCase();

        if (label.includes('1 day') || label.includes('full day') || label.includes('終日') || label.includes('cả ngày')) return `1 ${t('day')}`;
        if (label.includes('0.5 day') || label.includes('半休')) return `0.5 ${t('day')}`;
        if (label.includes('by the hour') || label.includes('時間単位')) return t('byHour');
        return t('fullDay');
    }, [leaveCategory, leaveMode, leaveDate, leaveEndDate, leaveOptions, t]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <header className="bg-sky-500 p-4 rounded-t-lg">
                    <h3 className="text-xl font-bold text-white">{t('newVacationRequest')}</h3>
                </header>
                <main className="p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6 grid grid-cols-4 items-center">
                            <label className="text-sm font-medium text-slate-700 col-span-1">{t('leaveMode')}</label>
                            <div className="col-span-3 flex gap-4">
                                <label className="flex items-center cursor-pointer">
                                    <input type="radio" name="leaveMode" value="single" checked={leaveMode === 'single'} onChange={() => setLeaveMode('single')} className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300" />
                                    <span className="ml-2 text-sm text-slate-800">{t('singleDayLeave')}</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input type="radio" name="leaveMode" value="multi" checked={leaveMode === 'multi'} onChange={() => setLeaveMode('multi')} className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300" />
                                    <span className="ml-2 text-sm text-slate-800">{t('multiDayLeave')}</span>
                                </label>
                            </div>
                        </div>

                        <div className="mb-6 grid grid-cols-4 items-center">
                            <label htmlFor="leaveCategory" className="text-sm font-medium text-slate-700 col-span-1">
                                {t('leaveType')} <span className="text-red-500">{t('required')}</span>
                            </label>
                            <div className="col-span-3">
                                <select id="leaveCategory" value={leaveCategory} onChange={e => setLeaveCategory(e.target.value)} required className="block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2">
                                    <option value="" disabled>{t('pleaseSelect')}</option>
                                    {leaveOptions.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="mb-6 grid grid-cols-4 items-center">
                            <label htmlFor="leaveDate" className="text-sm font-medium text-slate-700 col-span-1">
                                {leaveMode === 'single' ? t('dateOfLeave') : t('startDate')} <span className="text-red-500">{t('required')}</span>
                            </label>
                            <div className="col-span-1">
                                <input type="date" id="leaveDate" value={leaveDate} onChange={e => setLeaveDate(e.target.value)} className="block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2" />
                            </div>
                        </div>

                        {leaveMode === 'multi' && (
                            <div className="mb-6 grid grid-cols-4 items-center">
                                <label htmlFor="leaveEndDate" className="text-sm font-medium text-slate-700 col-span-1">
                                    {t('endDate')} <span className="text-red-500">{t('required')}</span>
                                </label>
                                <div className="col-span-1">
                                    <input type="date" id="leaveEndDate" value={leaveEndDate} onChange={e => setLeaveEndDate(e.target.value)} min={leaveDate} className="block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2" />
                                </div>
                            </div>
                        )}
                        
                        <div className="mb-6 grid grid-cols-4 items-center">
                            <label className="text-sm font-medium text-slate-700 col-span-1">{t('leaveDuration')}</label>
                            <div className="col-span-3"><span className="text-sm text-slate-800">{leaveDuration}</span></div>
                        </div>

                        <div className="mb-6 grid grid-cols-4 items-start">
                            <label htmlFor="reason" className="text-sm font-medium text-slate-700 col-span-1 mt-2">
                                {t('leaveReason')} <br/>
                                <span className="text-red-500 text-xs">{t('leaveReasonHint')}</span>
                            </label>
                            <div className="col-span-3">
                                <textarea id="reason" rows={4} value={reason} onChange={e => setReason(e.target.value)} required className="block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2"></textarea>
                            </div>
                        </div>
                        
                        <footer className="bg-slate-100 -mx-8 -mb-8 mt-8 p-4 rounded-b-lg flex justify-end">
                            <button type="submit" className="bg-sky-600 text-white font-bold py-2 px-6 rounded-md hover:bg-sky-700 transition-colors">{t('confirmButton')}</button>
                        </footer>
                    </form>
                </main>
            </div>
        </div>
    );
};
const CorrectionRequestModal: React.FC<{
    incident: WorkIncident;
    onClose: () => void;
    onSubmit: (incident: WorkIncident, requestedTime: string) => void;
    t: (key: string, options?: { [key: string]: string | number }) => any;
}> = ({ incident, onClose, onSubmit, t }) => {
    const [time, setTime] = useState('18:00');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const requestedDateTime = new Date(`${incident.date}T${time}:00`);
        onSubmit(incident, requestedDateTime.toISOString());
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <header className="bg-orange-500 p-4 rounded-t-lg">
                    <h3 className="text-xl font-bold text-white">{t('correctionRequestTitle')}</h3>
                </header>
                <main className="p-8">
                    <form onSubmit={handleSubmit}>
                        <p className="mb-4 text-slate-700">{t('correctionForDate', { date: incident.date })}</p>
                        <label htmlFor="clockout-time" className="block text-sm font-medium text-slate-700">{t('requestedClockOutTime')}</label>
                        <input 
                            type="time" 
                            id="clockout-time" 
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                        />
                        <footer className="bg-slate-100 -mx-8 -mb-8 mt-8 p-4 rounded-b-lg flex justify-end">
                            <button type="submit" className="bg-orange-600 text-white font-bold py-2 px-6 rounded-md hover:bg-orange-700 transition-colors">{t('confirmButton')}</button>
                        </footer>
                    </form>
                </main>
            </div>
        </div>
    );
};
const UserActivityLogModal: React.FC<{
    user: UserProfile;
    punches: { [dateKey: string]: Punch[] };
    leaves: Leave[];
    incidents: WorkIncident[];
    onClose: () => void;
    t: (key: string, options?: { [key: string]: string | number }) => any;
    language: Language;
}> = ({ user, punches, leaves, incidents, onClose, t, language }) => {
    const locale = language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'vi-VN';
    
    const allActivityDates = useMemo(() => {
        const dateSet = new Set<string>();
        Object.keys(punches).forEach(date => dateSet.add(date));
        leaves.forEach(leave => {
            const start = new Date(leave.startDate);
            const end = leave.endDate ? new Date(leave.endDate) : start;
            let current = new Date(start);
            // Handle timezone offset
            current.setMinutes(current.getMinutes() + current.getTimezoneOffset());
            end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

            while(current <= end) {
                dateSet.add(formatDateKey(current));
                current.setDate(current.getDate() + 1);
            }
        });
        incidents.forEach(incident => dateSet.add(incident.date));
        
        return Array.from(dateSet).sort((a, b) => b.localeCompare(a)); // Sort descending
    }, [punches, leaves, incidents]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-50 rounded-lg shadow-xl w-full max-w-3xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="bg-white p-4 rounded-t-lg border-b sticky top-0 flex justify-between items-center z-10">
                    <div>
                         <h3 className="text-xl font-bold text-slate-800">{t('userActivityLogTitle')}</h3>
                         <p className="text-sm text-slate-500">{user.name} ({user.employeeId})</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
                        <CloseIcon className="h-6 w-6"/>
                    </button>
                </header>
                <main className="p-4 sm:p-6 overflow-y-auto space-y-4">
                    {allActivityDates.length > 0 ? allActivityDates.map(dateKey => {
                        const dayPunches = punches[dateKey] || [];
                        const dayLeave = leaves.find(l => {
                             const d = new Date(dateKey + "T12:00:00Z");
                             const start = new Date(l.startDate);
                             const end = l.endDate ? new Date(l.endDate) : start;
                             start.setUTCHours(0,0,0,0);
                             end.setUTCHours(23,59,59,999);
                             return d >= start && d <= end;
                        });
                        const dayIncident = incidents.find(i => i.date === dateKey);
                        const workHours = calculateWorkHours(dayPunches);
                        const leaveStatusColor = dayLeave?.status === 'approved' ? 'bg-blue-100 text-blue-800' : dayLeave?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';

                        return (
                            <div key={dateKey} className="bg-white p-4 rounded-lg border border-slate-200">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-slate-700">{new Date(dateKey + 'T12:00:00').toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                                    {workHours > 0 && <span className="font-mono text-sm font-semibold bg-slate-100 px-2 py-1 rounded">{workHours.toFixed(1)}h</span>}
                                </div>
                                
                                {dayLeave && (
                                    <div className={`p-2 rounded-md mb-2 text-sm ${leaveStatusColor}`}>
                                        <p><span className="font-bold">{t('onLeaveRequest')}</span> {translations[language].leaveTypes[dayLeave.leaveType as keyof typeof translations[Language]['leaveTypes']] || dayLeave.leaveType} ({t(dayLeave.status)})</p>
                                        <p className="text-xs mt-1">{t('reasonLabel')} {dayLeave.reason}</p>
                                    </div>
                                )}

                                {dayIncident && (
                                     <div className="bg-orange-100 text-orange-800 p-2 rounded-md mb-2 text-sm">
                                        <p className="font-bold">{t('missedClockOut')}</p>
                                        <p className="text-xs mt-1">{t('status')}: {t(dayIncident.status)}</p>
                                    </div>
                                )}

                                {dayPunches.length > 0 ? (
                                    <div className="space-y-1">
                                        {dayPunches.map((punch, index) => (
                                            <div key={index} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded">
                                                <span className={`font-semibold ${punch.type === PunchType.ClockIn ? 'text-green-600' : 'text-red-600'}`}>{t(punch.type)}</span>
                                                <span className="font-mono">{new Date(punch.time).toLocaleTimeString(locale)}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (!dayLeave && !dayIncident && <p className="text-xs text-slate-400 text-center py-2">{t('noPunchActivity')}</p>)}
                            </div>
                        );
                    }) : <p className="text-center text-slate-500 py-8">{t('noActivityYet')}</p>}
                </main>
            </div>
        </div>
    );
};
const WorkStatistics: React.FC<{
  allPunches: { [key: string]: Punch[] };
  leavesByDate: { [key: string]: Leave };
  currentMonth: Date;
  t: (key: string) => any;
}> = ({ allPunches, leavesByDate, currentMonth, t }) => {
  const [activeTab, setActiveTab] = useState<'month' | 'week'>('month');

  const getWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); 
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return { start: startOfWeek, end: endOfWeek };
  };

  const getMonthRange = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    return { start: startOfMonth, end: endOfMonth };
  };

  const calculateStats = useCallback((start: Date, end: Date) => {
    let totalHours = 0;
    let workDays = new Set<string>();
    let leaveDays = new Set<string>();

    Object.keys(allPunches).forEach(dateKey => {
      const date = new Date(dateKey);
      date.setHours(12);
      if (date >= start && date <= end) {
        const hours = calculateWorkHours(allPunches[dateKey]);
        if (hours > 0) {
          totalHours += hours;
          workDays.add(dateKey);
        }
      }
    });
    
    Object.keys(leavesByDate).forEach(dateKey => {
      const date = new Date(dateKey);
       date.setHours(12);
      if (date >= start && date <= end && leavesByDate[dateKey].status === 'approved') {
        leaveDays.add(dateKey);
      }
    });
    
    const workingDaysCount = workDays.size;
    const averageHours = workingDaysCount > 0 ? totalHours / workingDaysCount : 0;

    return {
      totalHours: totalHours.toFixed(1),
      workingDays: workingDaysCount,
      leaveDays: leaveDays.size,
      averageHours: averageHours.toFixed(1),
    };
  }, [allPunches, leavesByDate]);
  
  const weeklyStats = useMemo(() => calculateStats(getWeekRange().start, getWeekRange().end), [calculateStats, allPunches, leavesByDate]);
  const monthlyStats = useMemo(() => calculateStats(getMonthRange().start, getMonthRange().end), [calculateStats, currentMonth, allPunches, leavesByDate]);
  const stats = activeTab === 'week' ? weeklyStats : monthlyStats;
  const StatCard = ({ label, value }: { label: string; value: string | number }) => (
    <div className="bg-sky-50 p-4 rounded-lg text-center transition-transform hover:scale-105">
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-sky-800 mt-1">{value}</p>
    </div>
  );

  return (
    <div className="w-full bg-white rounded-lg p-4 md:p-6 mt-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-700 border-b pb-2 mb-4">{t('workStatistics')}</h3>
      <div className="flex justify-center mb-4 bg-slate-100 rounded-lg p-1">
        <button onClick={() => setActiveTab('month')} className={`px-4 py-2 text-sm font-semibold rounded-md w-1/2 transition-colors duration-300 ${activeTab === 'month' ? 'bg-sky-600 text-white shadow' : 'text-slate-600 hover:bg-sky-100'}`}>{t('thisMonth')}</button>
        <button onClick={() => setActiveTab('week')} className={`px-4 py-2 text-sm font-semibold rounded-md w-1/2 transition-colors duration-300 ${activeTab === 'week' ? 'bg-sky-600 text-white shadow' : 'text-slate-600 hover:bg-sky-100'}`}>{t('thisWeek')}</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={t('totalHours')} value={`${stats.totalHours}h`} />
        <StatCard label={t('workDays')} value={stats.workingDays} />
        <StatCard label={t('leaveDays')} value={stats.leaveDays} />
        <StatCard label={t('avgHoursPerDay')} value={`${stats.averageHours}h`} />
      </div>
    </div>
  );
};
const UserProfileComponent: React.FC<{
    profile: UserProfile;
    onProfileChange: (profile: UserProfile) => void;
    t: (key: string) => any;
    isReadOnly?: boolean;
}> = ({ profile, onProfileChange, t, isReadOnly = false }) => {
    const [localProfile, setLocalProfile] = useState(profile);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLocalProfile(profile);
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalProfile({ ...localProfile, [e.target.name]: e.target.value });
    };
    const handleBlur = () => { onProfileChange(localProfile); };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newProfile = { ...localProfile, profilePictureUrl: event.target?.result as string };
                setLocalProfile(newProfile);
                onProfileChange(newProfile); // Propagate change immediately
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="w-full bg-white rounded-lg p-4 md:p-6 mt-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-700 border-b pb-2 mb-4 flex items-center gap-2">
                <UserIcon className="h-6 w-6 text-slate-500" />
                {t('userProfileTitle')}
            </h3>
            <div className="flex justify-center mb-6">
                <div className="relative">
                    {localProfile.profilePictureUrl ? (
                        <img src={localProfile.profilePictureUrl} alt="Profile" className="h-24 w-24 rounded-full object-cover border-4 border-slate-200" />
                    ) : (
                        <div className="h-24 w-24 rounded-full bg-slate-200 flex items-center justify-center border-4 border-slate-200">
                            <UserIcon className="h-12 w-12 text-slate-500" />
                        </div>
                    )}
                    {!isReadOnly && (
                        <>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                            <button 
                                onClick={() => fileInputRef.current?.click()} 
                                className="absolute bottom-0 right-0 bg-sky-600 text-white rounded-full p-1.5 hover:bg-sky-700 transition-colors"
                                aria-label="Upload profile picture"
                            >
                                <CameraIcon className="h-4 w-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">{t('nameLabel')}</label>
                    <input type="text" name="name" id="name" value={localProfile.name} onChange={handleChange} onBlur={handleBlur} readOnly={isReadOnly} disabled={isReadOnly} className={`mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 ${isReadOnly ? 'bg-slate-100' : ''}`} />
                </div>
                <div>
                    <label htmlFor="employeeId" className="block text-sm font-medium text-slate-700">{t('employeeIdLabel')}</label>
                    <input type="text" name="employeeId" id="employeeId" value={localProfile.employeeId} readOnly disabled className="mt-1 block w-full rounded-md border-slate-300 shadow-sm sm:text-sm p-2 bg-slate-100" />
                </div>
            </div>
        </div>
    );
};
const UserManagement: React.FC<{
    allUsers: UserProfile[];
    setAllUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
    setAllUsersPunches: React.Dispatch<React.SetStateAction<{ [employeeId: string]: { [dateKey: string]: Punch[] } }>>;
    setAllLeaves: React.Dispatch<React.SetStateAction<{ [key: string]: Leave }>>;
    setAllIncidents: React.Dispatch<React.SetStateAction<{ [incidentId: string]: WorkIncident }>>;
    onViewLog: (user: UserProfile) => void;
    t: (key: string, options?: { [key: string]: string | number }) => any;
}> = ({ allUsers, setAllUsers, setAllUsersPunches, setAllLeaves, setAllIncidents, onViewLog, t }) => {
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<UserProfile>>({});
    
    const [newUser, setNewUser] = useState<Partial<UserProfile>>({ name: '', employeeId: '', password: '', role: 'user' });

    const handleAddNewUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUser.name || !newUser.employeeId || !newUser.password) {
            alert("Please fill all fields for the new user.");
            return;
        }
        if (allUsers.some(u => u.employeeId === newUser.employeeId)) {
            alert(t('employeeIdExists'));
            return;
        }
        const userToAdd = { ...newUser, creationDate: new Date().toISOString() } as UserProfile;
        setAllUsers(prev => [...prev, userToAdd]);
        setNewUser({ name: '', employeeId: '', password: '', role: 'user' });
    };

    const handleEditClick = (user: UserProfile) => {
        setEditingUserId(user.employeeId);
        setEditFormData(user);
    };

    const handleCancelEdit = () => {
        setEditingUserId(null);
        setEditFormData({});
    };

    const handleSaveEdit = (employeeId: string) => {
        setAllUsers(prev => prev.map(user => {
            if (user.employeeId === employeeId) {
                const updatedData = { ...editFormData };
                // If the password field is empty, don't change the password.
                if (!updatedData.password?.trim()) {
                    delete updatedData.password;
                }
                return { ...user, ...updatedData };
            }
            return user;
        }));
        handleCancelEdit();
    };

    const handleDeleteUser = (employeeId: string) => {
        if (window.confirm(t('confirmDeleteUser') as string)) {
            // Remove user profile
            setAllUsers(prev => prev.filter(user => user.employeeId !== employeeId));

            // Remove associated punches
            setAllUsersPunches(prev => {
                const newPunches = { ...prev };
                delete newPunches[employeeId];
                return newPunches;
            });

            // Remove associated leaves
            setAllLeaves(prev => {
                const newLeaves: { [key: string]: Leave } = {};
                Object.keys(prev).forEach(key => {
                    if (prev[key].employeeId !== employeeId) {
                        newLeaves[key] = prev[key];
                    }
                });
                return newLeaves;
            });
            
            // Remove associated incidents
            setAllIncidents(prev => {
                const newIncidents: { [incidentId: string]: WorkIncident } = {};
                Object.keys(prev).forEach(key => {
                    if (prev[key].employeeId !== employeeId) {
                        newIncidents[key] = prev[key];
                    }
                });
                return newIncidents;
            });
        }
    };

    return (
        <div className="w-full bg-white rounded-lg p-4 md:p-6 mt-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-700 border-b pb-2 mb-4 flex items-center gap-2">
                <UsersIcon className="h-6 w-6 text-slate-500" />
                {t('userManagement')}
            </h3>

            {/* Add User Form */}
            <div className="bg-slate-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-slate-600 mb-3">{t('addNewUser')}</h4>
                <form onSubmit={handleAddNewUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    <input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder={t('nameLabel') as string} className="p-2 border rounded-md" required />
                    <input value={newUser.employeeId} onChange={e => setNewUser({ ...newUser, employeeId: e.target.value.toUpperCase() })} placeholder={t('employeeIdLabel') as string} className="p-2 border rounded-md" required />
                    <div>
                        <input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder={t('passwordLabel') as string} className="p-2 border rounded-md w-full" required />
                        <PasswordStrengthMeter password={newUser.password || ''} t={t} />
                    </div>
                    <div className="flex items-center gap-4 self-end">
                        <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value as 'user' | 'admin' })} className="p-2 border rounded-md w-full">
                            <option value="user">{t('userRole')}</option>
                            <option value="admin">{t('adminRole')}</option>
                        </select>
                         <button type="submit" className="bg-sky-600 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-700">{t('addUser')}</button>
                    </div>
                </form>
            </div>

            {/* Users List */}
            <div className="space-y-2">
                {allUsers.map(user => (
                    <div key={user.employeeId} className="bg-white p-3 rounded-md border border-slate-200">
                        {editingUserId === user.employeeId ? (
                            // Edit View
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-start">
                                <input value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} className="p-2 border rounded-md col-span-1 self-center" />
                                <span className="text-sm text-slate-500 self-center">{user.employeeId}</span>
                                <div>
                                    <input type="password" onChange={e => setEditFormData({ ...editFormData, password: e.target.value })} placeholder="New Password" className="p-2 border rounded-md col-span-1 w-full" />
                                    <PasswordStrengthMeter password={editFormData.password || ''} t={t} />
                                </div>
                                <select value={editFormData.role} onChange={e => setEditFormData({ ...editFormData, role: e.target.value as 'user' | 'admin' })} className="p-2 border rounded-md self-center">
                                    <option value="user">{t('userRole')}</option>
                                    <option value="admin">{t('adminRole')}</option>
                                </select>
                                <div className="flex gap-2 justify-end self-center">
                                    <button onClick={() => handleSaveEdit(user.employeeId)} className="bg-green-500 text-white text-sm py-1 px-3 rounded">{t('save')}</button>
                                    <button onClick={handleCancelEdit} className="bg-slate-400 text-white text-sm py-1 px-3 rounded">{t('cancel')}</button>
                                </div>
                            </div>
                        ) : (
                            // Display View
                             <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                                <div className="flex items-center gap-3 col-span-2">
                                     {user.profilePictureUrl ? (
                                        <img src={user.profilePictureUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                                     ) : (
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                            <UserIcon className="h-6 w-6 text-slate-400" />
                                        </div>
                                     )}
                                     <div>
                                        <p className="font-semibold text-slate-800">{user.name}</p>
                                        <p className="text-sm text-slate-500 font-mono">{user.employeeId}</p>
                                    </div>
                                </div>
                                <p className={`text-sm font-semibold px-2 py-1 rounded-full w-fit col-span-1 ${user.role === 'admin' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-800'}`}>{t(`${user.role}Role`)}</p>
                                <div className="flex gap-2 justify-end col-span-2">
                                    <button onClick={() => onViewLog(user)} className="bg-slate-500 hover:bg-slate-600 text-white text-sm py-1 px-3 rounded flex items-center gap-1.5 transition-colors">{t('viewLog')}</button>
                                    <button onClick={() => handleEditClick(user)} className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded transition-colors">{t('edit')}</button>
                                    {user.role !== 'admin' && <button onClick={() => handleDeleteUser(user.employeeId)} className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded transition-colors">{t('delete')}</button>}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Admin Dashboard Components ---
const EmployeeStatusCard: React.FC<{
  user: UserProfile;
  todayPunches: Punch[];
  leaveToday: Leave | undefined;
  onSelectUser: (user: UserProfile) => void;
  t: (key: string) => any;
}> = ({ user, todayPunches, leaveToday, onSelectUser, t }) => {
  const lastPunch = todayPunches.length > 0 ? todayPunches[todayPunches.length - 1] : undefined;
  const isClockedIn = lastPunch?.type === PunchType.ClockIn;
  const hours = calculateWorkHours(todayPunches);
  const startTime = todayPunches.find(p => p.type === PunchType.ClockIn)?.time;
  
  let statusText = t('notClockedInStatus');
  let statusColor = 'bg-slate-100 text-slate-600';

  if (leaveToday?.status === 'approved') {
    statusText = t('onLeave');
    statusColor = 'bg-blue-100 text-blue-800';
  } else if (isClockedIn) {
    statusText = t('clockedInStatus');
    statusColor = 'bg-green-100 text-green-800';
  } else if (lastPunch) { // Has punched today but is not clocked in
    statusText = t('clockedOut');
    statusColor = 'bg-red-100 text-red-800';
  }
  
  return (
    <div onClick={() => onSelectUser(user)} className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-lg hover:border-sky-400 transition-all cursor-pointer hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
            {user.profilePictureUrl ? (
                <img src={user.profilePictureUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
            ) : (
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="h-6 w-6 text-slate-400" />
                </div>
            )}
            <h4 className="font-bold text-slate-800">{user.name}</h4>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>{statusText}</span>
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>{t('workingHours')}:</span>
          <span className="font-mono font-semibold">{hours.toFixed(1)}h</span>
        </div>
        <div className="flex justify-between">
          <span>{t('startTime')}:</span>
          <span className="font-mono font-semibold">
            {startTime ? new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          </span>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<{
  allUsers: UserProfile[];
  currentUser: UserProfile;
  allUsersPunches: { [employeeId: string]: { [dateKey: string]: Punch[] } };
  allLeaves: { [key: string]: Leave };
  onSelectUser: (user: UserProfile) => void;
  t: (key: string) => any;
}> = ({ allUsers, currentUser, allUsersPunches, allLeaves, onSelectUser, t }) => {
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive', 'on_leave'
  const [sortOption, setSortOption] = useState('name'); // 'name', 'status', 'hours'
  const [filterRole, setFilterRole] = useState('all'); // 'all', 'admin', 'user'
  
  const todayKey = formatDateKey(new Date());

  const processedUsers = useMemo(() => {
    let users = allUsers
      .filter(u => u.employeeId !== currentUser.employeeId);

    // Filter by role
    if (filterRole !== 'all') {
      users = users.filter(user => user.role === filterRole);
    }
      
    let mappedUsers = users.map(user => {
        const userPunches = allUsersPunches[user.employeeId] || {};
        const todayPunches = userPunches[todayKey] || [];
        // FIX: Remove unnecessary type casts now that `Leave` type includes `startDate` and `endDate`. This resolves the error about missing properties.
        // FIX: Explicitly type 'l' to resolve 'property does not exist on type unknown' error.
        const leaveTodayCheck = Object.values(allLeaves).find((l: Leave) => l.employeeId === user.employeeId && formatDateKey(new Date(l.startDate)) <= todayKey && (l.endDate ? formatDateKey(new Date(l.endDate)) >= todayKey : formatDateKey(new Date(l.startDate)) === todayKey));
        const leaveToday = leaveTodayCheck;
        const lastPunch = todayPunches.length > 0 ? todayPunches[todayPunches.length - 1] : undefined;
        const isClockedIn = lastPunch?.type === PunchType.ClockIn;
        const hours = calculateWorkHours(todayPunches);
        
        let status: 'active' | 'inactive' | 'on_leave' | 'clocked_out' = 'inactive';
        if (leaveToday?.status === 'approved') {
          status = 'on_leave';
        } else if (isClockedIn) {
          status = 'active';
        } else if (lastPunch) {
          status = 'clocked_out';
        }

        return {
          ...user,
          todayPunches,
          leaveToday,
          hours,
          status
        };
      });

    // Filtering by status
    if (filterStatus !== 'all') {
      mappedUsers = mappedUsers.filter(user => {
        if (filterStatus === 'active') return user.status === 'active';
        if (filterStatus === 'inactive') return user.status === 'inactive' || user.status === 'clocked_out';
        if (filterStatus === 'on_leave') return user.status === 'on_leave';
        return true;
      });
    }

    // Sorting
    mappedUsers.sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortOption === 'hours') {
        return b.hours - a.hours; // Descending
      }
      if (sortOption === 'status') {
        const statusOrder = { active: 0, on_leave: 1, clocked_out: 2, inactive: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return 0;
    });

    return mappedUsers;
  }, [allUsers, currentUser, allUsersPunches, allLeaves, todayKey, filterStatus, filterRole, sortOption]);


  return (
    <div className="w-full bg-white rounded-lg p-4 md:p-6 mt-6 border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-4">
            <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-3 md:mb-0">
                <UsersIcon className="h-6 w-6 text-slate-500" />
                {t('adminDashboardTitle')}
            </h3>
            <div className="flex gap-2 sm:gap-4 w-full md:w-auto">
                <div className="flex-1">
                    <label htmlFor="filter-role" className="block text-xs font-medium text-slate-500">{t('filterBy')} {t('roleLabel')}</label>
                    <select id="filter-role" value={filterRole} onChange={e => setFilterRole(e.target.value)} className="w-full mt-1 block rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2">
                        <option value="all">{t('all')}</option>
                        <option value="admin">{t('adminRole')}</option>
                        <option value="user">{t('userRole')}</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="filter-status" className="block text-xs font-medium text-slate-500">{t('filterBy')} {t('status')}</label>
                    <select id="filter-status" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full mt-1 block rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2">
                        <option value="all">{t('all')}</option>
                        <option value="active">{t('active')}</option>
                        <option value="inactive">{t('inactive')}</option>
                        <option value="on_leave">{t('onLeaveFilter')}</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="sort-option" className="block text-xs font-medium text-slate-500">{t('sortBy')}</label>
                    <select id="sort-option" value={sortOption} onChange={e => setSortOption(e.target.value)} className="w-full mt-1 block rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2">
                        <option value="name">{t('sortName')}</option>
                        <option value="status">{t('sortStatus')}</option>
                        <option value="hours">{t('sortHours')}</option>
                    </select>
                </div>
            </div>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {processedUsers.length > 0 ? (
          processedUsers.map(user => {
            return (
              <EmployeeStatusCard
                key={user.employeeId}
                user={user}
                todayPunches={user.todayPunches}
                leaveToday={user.leaveToday}
                onSelectUser={onSelectUser}
                t={t}
              />
            );
          })
        ) : (
          <p className="text-slate-500 text-center col-span-full py-4">{t('noOtherUsers')}</p>
        )}
      </div>
    </div>
  );
};

const LeaveApprovalNotification: React.FC<{
  allLeaves: { [key: string]: Leave };
  allUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  t: (key: string, options?: { [key: string]: string | number }) => any;
}> = ({ allLeaves, allUsers, onSelectUser, t }) => {
  const pendingRequestsByUser = useMemo(() => {
    const pending: { [employeeId: string]: { name: string, count: number, user: UserProfile } } = {};

    // FIX: Explicitly type 'leave' to resolve 'property does not exist on type unknown' error.
    Object.values(allLeaves).forEach((leave: Leave) => {
      if (leave.status === 'pending') {
        if (!pending[leave.employeeId]) {
          const user = allUsers.find(u => u.employeeId === leave.employeeId);
          if (user) {
            pending[leave.employeeId] = { name: user.name, count: 0, user };
          }
        }
        if (pending[leave.employeeId]) {
            pending[leave.employeeId].count++;
        }
      }
    });
    return Object.values(pending);
  }, [allLeaves, allUsers]);

  if (pendingRequestsByUser.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 mt-6 rounded-r-lg">
        <h3 className="font-bold mb-2 flex items-center gap-2">
            <BellIcon className="h-5 w-5"/>
            {t('leaveApprovalsTitle')}
        </h3>
        <div className="space-y-2">
            {pendingRequestsByUser.map(({ user, name, count }) => (
                <div 
                    key={user.employeeId} 
                    onClick={() => onSelectUser(user)}
                    className="p-2 bg-blue-100 rounded-md cursor-pointer hover:bg-blue-200 transition-colors"
                >
                    <p className="text-sm font-semibold">
                        {t('pendingLeaveNotification', { name, count })}
                    </p>
                </div>
            ))}
        </div>
    </div>
  );
};

const MissedClockOutNotification: React.FC<{
    incidents: WorkIncident[];
    onCorrect: (incident: WorkIncident) => void;
    t: (key: string, options?: { [key: string]: string | number }) => any;
}> = ({ incidents, onCorrect, t }) => {
    if (incidents.length === 0) return null;

    return (
        <div className="w-full bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mt-6 rounded-r-lg" role="alert">
            <div className="flex">
                <div className="py-1"><AlertTriangleIcon className="h-6 w-6 text-orange-500 mr-4"/></div>
                <div>
                    <p className="font-bold">{t('missedClockOutNotificationTitle')}</p>
                    <p className="text-sm">{t('missedClockOutNotificationText', { count: incidents.length })}</p>
                    <div className="mt-2 space-x-2">
                        {incidents.map(inc => (
                             <button key={inc.id} onClick={() => onCorrect(inc)} className="text-sm font-bold text-orange-600 hover:text-orange-800 bg-orange-200 px-3 py-1 rounded-md">{t('correctTime')}: {inc.date}</button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CorrectionApprovalNotification: React.FC<{
  allIncidents: { [id: string]: WorkIncident };
  onApprove: (incident: WorkIncident, status: 'approved' | 'rejected') => void;
  t: (key: string, options?: { [key: string]: string | number }) => any;
}> = ({ allIncidents, onApprove, t }) => {
  const pendingCorrections = useMemo(() => {
    // FIX: Add explicit type for 'inc' to resolve 'property does not exist on type unknown' error.
    return Object.values(allIncidents).filter((inc: WorkIncident) => inc.status === 'pending_approval');
  }, [allIncidents]);

  if (pendingCorrections.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-purple-50 border-l-4 border-purple-500 text-purple-800 p-4 mt-6 rounded-r-lg">
        <h3 className="font-bold mb-2 flex items-center gap-2">
            <BellIcon className="h-5 w-5"/>
            {t('correctionApprovalsTitle')}
        </h3>
        <div className="space-y-2">
            {pendingCorrections.map((incident) => {
                const requestedTime = incident.requestedTime ? new Date(incident.requestedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                return (
                     <div key={incident.id} className="p-3 bg-purple-100 rounded-md">
                        <p className="text-sm font-semibold">
                           {t('pendingCorrectionNotification', { name: incident.name, date: incident.date, time: requestedTime })}
                        </p>
                        <div className="mt-2 flex gap-2">
                            <button onClick={() => onApprove(incident, 'approved')} className="bg-green-600 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-green-700">{t('approve')}</button>
                            <button onClick={() => onApprove(incident, 'rejected')} className="bg-red-600 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-red-700">{t('reject')}</button>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

// --- Weather Components ---
interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    main: 'Clear' | 'Clouds' | 'Rain' | 'Snow';
    description: string;
  };
  hourly: {
    date: Date;
    temp: number;
    main: 'Clear' | 'Clouds' | 'Rain' | 'Snow';
  }[];
  daily: {
    date: Date;
    temp_max: number;
    temp_min: number;
    main: 'Clear' | 'Clouds' | 'Rain' | 'Snow';
  }[];
}

const wmoDescriptions: { [key: number]: string } = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle', 56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain', 66: 'Light freezing rain', 67: 'Heavy freezing rain',
    71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall', 77: 'Snow grains',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    85: 'Slight snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
};

const mapWmoCodeToWeather = (code: number): { main: 'Clear' | 'Clouds' | 'Rain' | 'Snow', description: string } => {
    const description = wmoDescriptions[code] || 'Unknown weather';
    let main: 'Clear' | 'Clouds' | 'Rain' | 'Snow';

    if (code === 0) main = 'Clear';
    else if (code >= 1 && code <= 3) main = 'Clouds';
    else if (code === 45 || code === 48) main = 'Clouds';
    else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95 && code <= 99)) main = 'Rain';
    else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) main = 'Snow';
    else main = 'Clear';

    return { main, description };
};


const fetchRealWeather = async (lat: number, lon: number): Promise<WeatherData> => {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();

    const currentWeatherData = mapWmoCodeToWeather(data.current.weather_code);
    const current = {
        temp: Math.round(data.current.temperature_2m),
        feels_like: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        wind_speed: data.current.wind_speed_10m,
        main: currentWeatherData.main,
        description: currentWeatherData.description,
    };

    const hourly = data.hourly.time.map((time: string, index: number) => ({
        date: new Date(time),
        temp: Math.round(data.hourly.temperature_2m[index]),
        main: mapWmoCodeToWeather(data.hourly.weather_code[index]).main,
    })).slice(0, 24);

    const daily = data.daily.time.map((time: string, index: number) => ({
        date: new Date(time),
        temp_max: Math.round(data.daily.temperature_2m_max[index]),
        temp_min: Math.round(data.daily.temperature_2m_min[index]),
        main: mapWmoCodeToWeather(data.daily.weather_code[index]).main,
    }));

    return { current, hourly, daily };
};

const WeatherBackground: React.FC<{ weatherCondition?: WeatherData['current']['main'] }> = ({ weatherCondition }) => {
  if (!weatherCondition) return null;

  const renderRain = () => (
    <div className="rain fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: 70 }).map((_, i) => <div key={i} className="raindrop" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`, animationDuration: `${0.5 + Math.random() * 0.5}s` }}></div>)}
    </div>
  );

  const renderClouds = () => (
    <div className="clouds fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <div className="cloud x1"></div>
      <div className="cloud x2"></div>
      <div className="cloud x3"></div>
      <div className="cloud x4"></div>
      <div className="cloud x5"></div>
    </div>
  );

  const renderSun = () => (
    <div className="sun-container fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <div className="sun"></div>
    </div>
  );

  switch (weatherCondition) {
    case 'Rain':
      return renderRain();
    case 'Clouds':
      return renderClouds();
    case 'Clear':
      return renderSun();
    default:
      return null;
  }
};

const WeatherWidget: React.FC<{
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  t: (key: string) => any;
  language: Language;
}> = ({ weather, isLoading, error, t, language }) => {
  const [activeTab, setActiveTab] = useState<'today' | 'hourly' | 'daily'>('today');

  const getWeatherIcon = (main: WeatherData['current']['main']) => {
    switch (main) {
        case 'Clear': return '☀️';
        case 'Clouds': return '☁️';
        case 'Rain': return '🌧️';
        case 'Snow': return '❄️';
        default: return '❓';
    }
  };
  
  const getWeatherMessage = (currentWeather: WeatherData['current']) => {
      if (currentWeather.main === 'Rain') {
          return t('weather.rainWarning');
      }
      if (currentWeather.main === 'Clear' && currentWeather.temp > 29) {
          return t('weather.uvWarning');
      }
      return t('weather.niceDay');
  };

  const WeatherInfoDetail: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 text-sm text-slate-600">
        <div className="w-5 h-5">{icon}</div>
        <span>{label}</span>
        <span className="font-bold text-slate-800">{value}</span>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
       return <div className="text-center text-slate-500 py-4">{t('weather.loading')}</div>
    }
    if (error) {
      return <p className="text-center text-red-500 text-sm py-4">{error}</p>;
    }
    
    if (weather) {
        const { current, hourly, daily } = weather;
        const locale = language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'vi-VN';
        const weekdays = translations[language].weekdays;
        
        return (
          <div className="relative">
            <div className="flex justify-center mb-4 bg-slate-100 rounded-lg p-1">
              <button onClick={() => setActiveTab('today')} className={`px-4 py-2 text-sm font-semibold rounded-md w-1/3 transition-colors duration-300 ${activeTab === 'today' ? 'bg-sky-600 text-white shadow' : 'text-slate-600 hover:bg-sky-100'}`}>{t('weather.today')}</button>
              <button onClick={() => setActiveTab('hourly')} className={`px-4 py-2 text-sm font-semibold rounded-md w-1/3 transition-colors duration-300 ${activeTab === 'hourly' ? 'bg-sky-600 text-white shadow' : 'text-slate-600 hover:bg-sky-100'}`}>{t('weather.hourly')}</button>
              <button onClick={() => setActiveTab('daily')} className={`px-4 py-2 text-sm font-semibold rounded-md w-1/3 transition-colors duration-300 ${activeTab === 'daily' ? 'bg-sky-600 text-white shadow' : 'text-slate-600 hover:bg-sky-100'}`}>{t('weather.daily')}</button>
            </div>

            {activeTab === 'today' && (
              <div className="text-center p-4">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-7xl">{getWeatherIcon(current.main)}</span>
                  <p className="text-6xl font-bold text-slate-800">{Math.round(current.temp)}°C</p>
                  <p className="text-slate-500 capitalize text-lg">{current.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 border-t pt-4">
                    <WeatherInfoDetail icon={<ThermometerIcon className="text-red-500" />} label={t('weather.feelsLike')} value={`${current.feels_like}°`} />
                    <WeatherInfoDetail icon={<DropletIcon className="text-sky-500" />} label={t('weather.humidity')} value={`${current.humidity}%`} />
                    <WeatherInfoDetail icon={<WindIcon className="text-slate-500" />} label={t('weather.windSpeed')} value={`${current.wind_speed} km/h`} />
                </div>
                <p className="mt-6 text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg">{getWeatherMessage(current)}</p>
              </div>
            )}
            
            {activeTab === 'hourly' && (
                <div className="flex overflow-x-auto space-x-2 p-2 -mx-2">
                    {hourly.map((hour, index) => (
                        <div key={index} className="flex-shrink-0 w-24 text-center bg-slate-50 rounded-lg p-3 border border-slate-200">
                            <p className="text-sm font-semibold text-slate-700">{hour.date.toLocaleTimeString(locale, { hour: 'numeric' })}</p>
                            <p className="text-3xl my-2">{getWeatherIcon(hour.main)}</p>
                            <p className="text-lg font-bold text-slate-800">{hour.temp}°</p>
                        </div>
                    ))}
                </div>
            )}
            
            {activeTab === 'daily' && (
                <div className="space-y-2">
                    {daily.map((day, index) => {
                        const dayIndex = day.date.getDay();
                        const dayName = weekdays[dayIndex === 0 ? 6 : dayIndex - 1];
                        const tempRange = Math.abs(day.temp_max - day.temp_min);
                        const minTemp = Math.min(...daily.map(d => d.temp_min));
                        const maxTemp = Math.max(...daily.map(d => d.temp_max));
                        const totalRange = maxTemp - minTemp;
                        const leftOffset = totalRange > 0 ? ((day.temp_min - minTemp) / totalRange) * 100 : 0;
                        const barWidth = totalRange > 0 ? (tempRange / totalRange) * 100 : 100;

                        return (
                            <div key={index} className="flex justify-between items-center bg-slate-50 rounded-lg p-2.5">
                                <p className="w-1/4 text-sm font-semibold text-slate-700">{dayName}</p>
                                <p className="w-1/4 text-2xl text-center">{getWeatherIcon(day.main)}</p>
                                <div className="w-1/2 flex justify-end items-center gap-2">
                                    <p className="text-sm font-semibold text-slate-500">{day.temp_min}°</p>
                                    <div className="w-20 h-1.5 bg-slate-200 rounded-full">
                                        <div className="h-full bg-gradient-to-r from-sky-300 to-orange-400 rounded-full" style={{ marginLeft: `${leftOffset}%`, width: `${barWidth}%` }}></div>
                                    </div>
                                    <p className="text-sm font-bold text-slate-800">{day.temp_max}°</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
          </div>
        );
    }
    
    return null;
  };
  
  return (
    <div className="w-full bg-white rounded-lg p-4 md:p-6 mt-6 border border-slate-200 relative z-10">
      <h3 className="text-lg font-bold text-slate-700 border-b pb-2 mb-4 flex items-center gap-2">
        <LocationIcon className="h-6 w-6 text-slate-500" />
        {t('weather.title')}
      </h3>
      {renderContent()}
    </div>
  );
};
const WorkAnniversaryCard: React.FC<{
  user: UserProfile;
  t: (key: string, options?: { [key:string]: string|number }) => any;
}> = ({ user, t }) => {
  if (!user.creationDate) {
    return null;
  }

  const workStartDate = new Date(user.creationDate);
  const today = new Date();
  workStartDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - workStartDate.getTime();
  const diffDays = Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);

  return (
    <div className="w-full bg-gradient-to-br from-sky-50 to-indigo-100 rounded-lg p-4 md:p-6 mt-6 border border-sky-200 text-center shadow-lg">
      <p className="text-slate-600 mb-4">{t('workAnniversary.thankYouMessage', { name: user.name })}</p>
      <div className="flex items-center justify-center gap-4">
        <AwardIcon className="h-16 w-16 text-yellow-500" />
        <div>
          <p className="text-6xl font-bold text-sky-800 tracking-tight">{diffDays}</p>
          <p className="text-lg text-slate-500 font-semibold -mt-1">{t('workAnniversary.daysUnit')}</p>
        </div>
      </div>
    </div>
  );
};


// --- Login Page Component ---
const LoginPage: React.FC<{ onLogin: (employeeId: string, pass: string) => boolean, t: (key: string) => any, setLanguage: (lang: Language) => void, language: Language }> = ({ onLogin, t, setLanguage, language }) => {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (loginError) setLoginError(false);
        setter(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (employeeId.trim() && password.trim()) {
            const success = onLogin(employeeId.trim().toUpperCase(), password);
            if (!success) {
                setLoginError(true);
            }
        }
    };
    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-sm mx-auto">
                <div className="w-full flex justify-end mb-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="language-select" className="text-sm font-medium text-slate-600">{t('languageLabel')}:</label>
                        <select id="language-select" value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-1">
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English</option>
                            <option value="ja">日本語</option>
                        </select>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
                    <header className="mb-8 text-center">
                        <img src="https://pro-vision.vn/wp-content/uploads/2024/09/logo_holizonal.svg" className="custom-logo h-12 mx-auto mb-4" alt="株式会社ProVison VN" />
                        <h2 className="text-2xl font-bold text-slate-800">{t('loginTitle')}</h2>
                    </header>
                    {loginError && (
                        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-6" role="alert">
                            <p className="font-bold">{t('loginFailed')}</p>
                            <p className="text-sm">{t('loginContactAdmin')}</p>
                        </div>
                    )}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="employeeId" className="block text-sm font-medium text-slate-700">{t('employeeIdLabel')}</label>
                            <input
                                type="text"
                                id="employeeId"
                                value={employeeId}
                                onChange={handleInputChange(setEmployeeId)}
                                required
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2"
                                placeholder="ADMIN"
                            />
                        </div>
                        <div>
                            <label htmlFor="password"
                                className="block text-sm font-medium text-slate-700">{t('passwordLabel')}</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={handleInputChange(setPassword)}
                                required
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2"
                                placeholder="admin"
                            />
                        </div>
                        <button type="submit" className="w-full flex items-center justify-center bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 transition-colors">
                            <LoginIcon className="h-6 w-6 mr-2" />
                            {t('loginButton')}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};
// --- App Container (Handles Auth and State) ---
const App: React.FC = () => {
    // Global State
    const [language, setLanguage] = useState<Language>('vi');
    const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
        try {
            const item = window.localStorage.getItem('allUsers_v2');
            if (item) return JSON.parse(item);
            
            // Default data if nothing in localStorage
            return [
              { name: "Admin", employeeId: "ADMIN", password: "admin", role: "admin", creationDate: "2023-01-15T10:00:00Z", profilePictureUrl: `https://i.pravatar.cc/150?u=ADMIN` },
              { name: "Test User", employeeId: "USER001", password: "password", role: "user", creationDate: "2024-03-01T10:00:00Z", profilePictureUrl: `https://i.pravatar.cc/150?u=USER001` }
            ];
        } catch (error) {
            console.error(error);
            return [];
        }
    });
    const [allUsersPunches, setAllUsersPunches] = useState<{ [employeeId: string]: { [dateKey: string]: Punch[] } }>(() => {
        try {
            const item = window.localStorage.getItem('allUsersPunches_v2');
            return item ? JSON.parse(item) : {};
        } catch (error) {
            console.error(error);
            return {};
        }
    });
    // FIX: Update state type to use the updated `Leave` interface, removing the need for an intersection type.
     const [allLeaves, setAllLeaves] = useState<{ [key: string]: Leave }>(() => {
        try {
            const item = window.localStorage.getItem('allLeaves_v2');
            return item ? JSON.parse(item) : {};
        } catch (error) {
            console.error(error);
            return {};
        }
    });
    const [allIncidents, setAllIncidents] = useState<{ [incidentId: string]: WorkIncident }>(() => {
        try {
            const item = window.localStorage.getItem('allIncidents_v1');
            return item ? JSON.parse(item) : {};
        } catch (error) {
            console.error(error);
            return {};
        }
    });
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [incidentToCorrect, setIncidentToCorrect] = useState<WorkIncident | null>(null);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [impersonatedUser, setImpersonatedUser] = useState<UserProfile | null>(null);
    const [viewingUserLog, setViewingUserLog] = useState<UserProfile | null>(null);
    
    // Weather State
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [weatherError, setWeatherError] = useState<string | null>(null);
    const [isLoadingWeather, setIsLoadingWeather] = useState(false);
    const [hasRequestedWeather, setHasRequestedWeather] = useState(false);

    // --- Effects ---
    useEffect(() => {
        try {
            window.localStorage.setItem('allUsers_v2', JSON.stringify(allUsers));
        } catch (error) { console.error("Could not save users:", error); }
    }, [allUsers]);

    useEffect(() => {
        try {
            window.localStorage.setItem('allUsersPunches_v2', JSON.stringify(allUsersPunches));
        } catch (error) { console.error("Could not save punches:", error); }
    }, [allUsersPunches]);
    
    useEffect(() => {
        try {
            window.localStorage.setItem('allLeaves_v2', JSON.stringify(allLeaves));
        } catch (error) { console.error("Could not save leaves:", error); }
    }, [allLeaves]);

    useEffect(() => {
        try {
            window.localStorage.setItem('allIncidents_v1', JSON.stringify(allIncidents));
        } catch (error) { console.error("Could not save incidents:", error); }
    }, [allIncidents]);
    
    const t = useCallback((key: string, options?: { [key: string]: string | number }) => {
        const keys = key.split('.');
        let result: any = translations[language];
        for (const k of keys) {
            result = result[k];
            if (result === undefined) return key;
        }
        if (typeof result === 'string' && options) {
            Object.keys(options).forEach(optKey => {
                const value = options[optKey];
                result = result.replace(new RegExp(`\\{${optKey}\\}`, 'g'), String(value));
            });
        }
        return result;
    }, [language]);
    
    useEffect(() => {
        if (currentUser && !hasRequestedWeather) {
            setIsLoadingWeather(true);
            setHasRequestedWeather(true); // Prevent re-fetching on re-renders
            if (!navigator.geolocation) {
              setWeatherError(t('weather.notSupported'));
              setIsLoadingWeather(false);
              return;
            }
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                try {
                  const weatherData = await fetchRealWeather(position.coords.latitude, position.coords.longitude);
                  setWeather(weatherData);
                  setWeatherError(null);
                } catch (e) {
                  setWeatherError(t('weather.fetchError'));
                } finally {
                  setIsLoadingWeather(false);
                }
              },
              () => {
                setWeatherError(t('weather.permissionDenied'));
                setIsLoadingWeather(false);
              }
            );
        }
    }, [currentUser, hasRequestedWeather, t]);


    // Detect missed clock-outs on login
    useEffect(() => {
        if (!currentUser) return;

        const userPunches = allUsersPunches[currentUser.employeeId] || {};
        const todayKey = formatDateKey(new Date());
        let newIncidentsFound = false;
        const updatedIncidents = { ...allIncidents };

        Object.keys(userPunches).forEach(dateKey => {
            if (dateKey >= todayKey) return; // Don't check today or future dates

            const punches = userPunches[dateKey];
            if (punches.length % 2 !== 0) {
                const lastPunch = punches[punches.length - 1];
                if (lastPunch.type === PunchType.ClockIn) {
                    const incidentId = `incident-${currentUser.employeeId}-${dateKey}`;
                    if (!updatedIncidents[incidentId]) {
                        updatedIncidents[incidentId] = {
                            id: incidentId,
                            type: IncidentType.MissedClockOut,
                            date: dateKey,
                            status: 'pending_correction',
                            employeeId: currentUser.employeeId,
                            name: currentUser.name,
                        };
                        newIncidentsFound = true;
                    }
                }
            }
        });

        if (newIncidentsFound) {
            setAllIncidents(updatedIncidents);
        }
    }, [currentUser, allUsersPunches]);

    // --- Handlers & Logic ---
    const handleLogin = (employeeId: string, pass: string): boolean => {
        const user = allUsers.find(u => u.employeeId === employeeId && u.password === pass);
        if (user) {
            setCurrentUser(user);
            return true;
        } else {
            return false;
        }
    };
    const handleLogout = () => {
        setCurrentUser(null);
        setIsAdminMode(false);
        setImpersonatedUser(null);
        setHasRequestedWeather(false);
        setWeather(null);
        setWeatherError(null);
    };

    const handlePunch = (type: PunchType) => {
        if (impersonatedUser) return; // Prevent punching for another user
        const now = new Date();
        const newPunch: Punch = { type, time: now };
        const dateKey = formatDateKey(now);

        setAllUsersPunches(prev => {
            const userPunches = prev[currentUser!.employeeId] || {};
            const dayPunches = userPunches[dateKey] || [];
            const updatedDayPunches = [...dayPunches, newPunch];
            return {
                ...prev,
                [currentUser!.employeeId]: {
                    ...userPunches,
                    [dateKey]: updatedDayPunches
                }
            };
        });
    };

    const handleMonthChange = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setDate(1); // Avoid issues with end of month
            newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
            return newMonth;
        });
    };
    const handleDayClick = (date: Date) => setSelectedDate(date);
    
    const handleRequestLeave = () => {
      if(selectedDate) setIsLeaveModalOpen(true);
      setSelectedDate(null);
    };

    const handleCorrectTime = () => {
        if(selectedDate) {
            const dateKey = formatDateKey(selectedDate);
            // FIX: Explicitly type 'inc' to resolve 'property does not exist on type unknown' error.
            const incident = Object.values(allIncidents).find((inc: WorkIncident) => inc.date === dateKey && inc.employeeId === currentUser!.employeeId);
            if (incident) setIncidentToCorrect(incident);
        }
        setSelectedDate(null);
    };

    const handleLeaveSubmit = (startDate: Date, endDate: Date | null, leaveType: string, reason: string) => {
        const leaveId = `leave-${currentUser!.employeeId}-${Date.now()}`;
        // FIX: Update `newLeave` to use the `Leave` type directly, as it now includes date properties.
        const newLeave: Leave = {
            reason,
            leaveType,
            status: 'pending',
            employeeId: currentUser!.employeeId,
            name: currentUser!.name,
            startDate: startDate.toISOString(),
            endDate: endDate?.toISOString()
        };
        setAllLeaves(prev => ({ ...prev, [leaveId]: newLeave }));
        setIsLeaveModalOpen(false);
    };

     const handleCorrectionSubmit = (incident: WorkIncident, requestedTime: string) => {
        setAllIncidents(prev => ({
            ...prev,
            [incident.id]: {
                ...incident,
                status: 'pending_approval',
                requestedTime: requestedTime,
            }
        }));
        setIncidentToCorrect(null);
    };
    
    const handleLeaveStatusChange = (leave: Leave, newStatus: 'approved' | 'rejected') => {
        const leaveId = Object.keys(allLeaves).find(key => allLeaves[key] === leave);
        if (leaveId) {
            setAllLeaves(prev => ({
                ...prev,
                [leaveId]: { ...prev[leaveId], status: newStatus }
            }));
        }
        setSelectedDate(null);
    };
    
     const handleCorrectionApproval = (incident: WorkIncident, status: 'approved' | 'rejected') => {
        if (status === 'approved' && incident.requestedTime) {
            const newPunch: Punch = { type: PunchType.ClockOut, time: new Date(incident.requestedTime) };
            
            setAllUsersPunches(prev => {
                const userPunches = prev[incident.employeeId] || {};
                const dayPunches = userPunches[incident.date] || [];
                const updatedDayPunches = [...dayPunches, newPunch];
                return {
                    ...prev,
                    [incident.employeeId]: { ...userPunches, [incident.date]: updatedDayPunches }
                };
            });

             setAllIncidents(prev => ({ ...prev, [incident.id]: { ...incident, status: 'resolved' } }));
        } else { // Rejected
            setAllIncidents(prev => ({ ...prev, [incident.id]: { ...incident, status: 'pending_correction' } }));
        }
    };

    const handleSelectUserInDashboard = (user: UserProfile) => {
        setImpersonatedUser(user);
        setCurrentMonth(new Date()); // Reset month view when switching users
    };
    
    const handleBackToDashboard = () => setImpersonatedUser(null);
    
    const handleProfileChange = (profile: UserProfile) => {
        const updatedUsers = allUsers.map(u => u.employeeId === profile.employeeId ? profile : u)
        setAllUsers(updatedUsers);
        if (currentUser?.employeeId === profile.employeeId) {
            setCurrentUser(profile);
        }
    }
    
    // --- Derived State ---
    const userToView = impersonatedUser || currentUser;
    const punchesForUserToView = userToView ? (allUsersPunches[userToView.employeeId] || {}) : {};
    const todayPunches = userToView ? (punchesForUserToView[formatDateKey(new Date())] || []) : [];
    const lastPunch = todayPunches.length > 0 ? todayPunches[todayPunches.length - 1] : undefined;
    const isClockedIn = lastPunch?.type === PunchType.ClockIn;
    
    const { leavesByDate, incidentsByDate } = useMemo(() => {
        const leavesMap: { [key: string]: Leave } = {};
        const incidentsMap: { [key: string]: WorkIncident } = {};
        const currentUserId = userToView?.employeeId;
        if (!currentUserId) return { leavesByDate: leavesMap, incidentsByDate: incidentsMap };

        // FIX: Explicitly type 'leave' to resolve 'property does not exist on type unknown' error.
        Object.values(allLeaves).forEach((leave: Leave) => {
            if (leave.employeeId === currentUserId) {
                const start = new Date(leave.startDate);
                const end = leave.endDate ? new Date(leave.endDate) : start;
                start.setHours(12, 0, 0, 0);
                end.setHours(12, 0, 0, 0);

                let currentDate = new Date(start);
                while (currentDate <= end) {
                    leavesMap[formatDateKey(currentDate)] = leave;
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        });

        // FIX: Explicitly type 'incident' to resolve 'property does not exist on type unknown' error.
        Object.values(allIncidents).forEach((incident: WorkIncident) => {
            if (incident.employeeId === currentUserId && incident.status !== 'resolved') {
                incidentsMap[incident.date] = incident;
            }
        });

        return { leavesByDate: leavesMap, incidentsByDate: incidentsMap };
    }, [allLeaves, allIncidents, userToView]);


    // --- Render Logic ---
    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} t={t} setLanguage={setLanguage} language={language}/>;
    }

    const MainContent = () => {
        if (isAdminMode && !impersonatedUser) {
            return (
                <>
                    <LeaveApprovalNotification
                        allLeaves={allLeaves}
                        allUsers={allUsers}
                        onSelectUser={handleSelectUserInDashboard}
                        t={t}
                    />
                    <CorrectionApprovalNotification
                        allIncidents={allIncidents}
                        onApprove={handleCorrectionApproval}
                        t={t}
                    />
                    <AdminDashboard 
                        allUsers={allUsers}
                        currentUser={currentUser}
                        allUsersPunches={allUsersPunches}
                        allLeaves={allLeaves}
                        onSelectUser={handleSelectUserInDashboard}
                        t={t}
                    />
                    <UserManagement 
                        allUsers={allUsers} 
                        setAllUsers={setAllUsers}
                        setAllUsersPunches={setAllUsersPunches}
                        setAllLeaves={setAllLeaves}
                        setAllIncidents={setAllIncidents}
                        onViewLog={setViewingUserLog}
                        t={t}
                    />
                </>
            );
        }
        
        const userIncidents = Object.values(allIncidents).filter(
            // FIX: Add explicit type for 'inc' to resolve 'property does not exist on type unknown' error.
            (inc: WorkIncident) => inc.employeeId === currentUser.employeeId && inc.status === 'pending_correction'
        );
        
        return (
            <div className="relative">
                <WeatherBackground weatherCondition={weather?.current.main} />
                {impersonatedUser && (
                    <button onClick={handleBackToDashboard} className="mb-4 text-sky-600 hover:text-sky-800 font-semibold relative z-10">{`‹ ${t('backToDashboard')}`}</button>
                )}
                {!impersonatedUser && (
                    <MissedClockOutNotification 
                        incidents={userIncidents} 
                        onCorrect={setIncidentToCorrect}
                        t={t}
                    />
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mt-4">
                    <div className="flex flex-col items-center">
                        <Clock language={language} />
                        <StatusDisplay isClockedIn={isClockedIn} lastPunch={lastPunch} t={t} language={language}/>
                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                            <button onClick={() => handlePunch(PunchType.ClockIn)} disabled={isClockedIn || !!impersonatedUser} className="bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white font-bold py-6 rounded-lg text-2xl transition-colors flex items-center justify-center gap-2"><ClockInIcon className="h-8 w-8"/>{t('clockIn')}</button>
                            <button onClick={() => handlePunch(PunchType.ClockOut)} disabled={!isClockedIn || !!impersonatedUser} className="bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white font-bold py-6 rounded-lg text-2xl transition-colors flex items-center justify-center gap-2"><ClockOutIcon className="h-8 w-8"/>{t('clockOut')}</button>
                        </div>
                        <TimeLog punches={todayPunches} t={t} language={language}/>
                        <Reminder allPunches={punchesForUserToView} t={t} />
                    </div>
                    <div>
                         <UserProfileComponent profile={userToView!} onProfileChange={handleProfileChange} t={t} isReadOnly={!!impersonatedUser || currentUser.employeeId !== userToView?.employeeId} />
                         {!impersonatedUser && <WorkAnniversaryCard user={userToView!} t={t} />}
                         {!impersonatedUser && <WeatherWidget weather={weather} isLoading={isLoadingWeather} error={weatherError} t={t} language={language} />}
                         <WorkStatistics allPunches={punchesForUserToView} leavesByDate={leavesByDate} currentMonth={currentMonth} t={t}/>
                         <Calendar
                            currentMonth={currentMonth}
                            allPunches={punchesForUserToView}
                            leavesByDate={leavesByDate}
                            incidentsByDate={incidentsByDate}
                            onMonthChange={handleMonthChange}
                            onDayClick={handleDayClick}
                            t={t}
                            language={language}
                        />
                    </div>
                </div>
            </div>
        )
    };
    
    return (
        <div className="p-4 md:p-8 font-sans">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-7xl mx-auto overflow-hidden relative">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        {currentUser.profilePictureUrl ? (
                            <img src={currentUser.profilePictureUrl} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                                <UserIcon className="h-6 w-6 text-slate-500" />
                            </div>
                        )}
                        <span className="font-semibold text-slate-700 hidden sm:inline">{currentUser.name}</span>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:text-sky-600 font-semibold p-2 rounded-md transition-colors">
                            <LogoutIcon className="h-5 w-5"/> 
                            <span className="hidden md:inline">{t('logoutButton')}</span>
                        </button>
                    </div>
                     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 self-end md:self-center">
                        {currentUser.role === 'admin' && (
                            <label htmlFor="admin-mode-toggle" className="flex items-center cursor-pointer">
                                <span className="mr-3 text-sm font-medium text-slate-900">{t('adminMode')}</span>
                                <div className="relative">
                                    <input type="checkbox" id="admin-mode-toggle" className="sr-only" checked={isAdminMode} onChange={() => { setIsAdminMode(!isAdminMode); setImpersonatedUser(null); }} />
                                    <div className="block bg-slate-200 w-14 h-8 rounded-full"></div>
                                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform"></div>
                                </div>
                            </label>
                        )}
                        <div className="flex items-center gap-2">
                            <label htmlFor="language-select" className="text-sm font-medium text-slate-600">{t('languageLabel')}:</label>
                            <select id="language-select" value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-1">
                                <option value="vi">Tiếng Việt</option>
                                <option value="en">English</option>
                                <option value="ja">日本語</option>
                            </select>
                        </div>
                    </div>
                </header>
                 <div className="text-center mb-6">
                    <img src="https://pro-vision.vn/wp-content/uploads/2024/09/logo_holizonal.svg" className="custom-logo h-12 mx-auto mb-2" alt="株式会社ProVison VN" />
                    <h1 className="text-3xl font-bold text-slate-800">{t('timeSheetTitle')}</h1>
                </div>

                <MainContent />
            </div>

            {selectedDate && (
                <DayDetailModal
                    date={selectedDate}
                    punches={punchesForUserToView[formatDateKey(selectedDate)] || []}
                    leave={leavesByDate[formatDateKey(selectedDate)]}
                    incident={incidentsByDate[formatDateKey(selectedDate)]}
                    onClose={() => setSelectedDate(null)}
                    onRequestLeave={handleRequestLeave}
                    onCorrectTime={handleCorrectTime}
                    onLeaveStatusChange={handleLeaveStatusChange}
                    t={t}
                    language={language}
                    isAdminView={isAdminMode || currentUser.role === 'admin'}
                    isImpersonating={!!impersonatedUser}
                />
            )}
             {isLeaveModalOpen && (
                <LeaveRequestModal 
                    initialDate={selectedDate || new Date()}
                    onClose={() => { setIsLeaveModalOpen(false); }} 
                    onSubmit={handleLeaveSubmit}
                    t={t}
                    language={language}
                />
            )}
            {incidentToCorrect && (
                <CorrectionRequestModal
                    incident={incidentToCorrect}
                    onClose={() => setIncidentToCorrect(null)}
                    onSubmit={handleCorrectionSubmit}
                    t={t}
                />
            )}
            {viewingUserLog && (
                <UserActivityLogModal
                    user={viewingUserLog}
                    punches={allUsersPunches[viewingUserLog.employeeId] || {}}
                    // FIX: Explicitly type 'l' and 'i' to resolve 'property does not exist on type unknown' error.
                    leaves={Object.values(allLeaves).filter((l: Leave) => l.employeeId === viewingUserLog.employeeId)}
                    incidents={Object.values(allIncidents).filter((i: WorkIncident) => i.employeeId === viewingUserLog.employeeId)}
                    onClose={() => setViewingUserLog(null)}
                    t={t}
                    language={language}
                />
            )}
            <style>{`
                input:checked ~ .dot { transform: translateX(100%); background-color: #0284c7; }
                
                /* Weather Animations */
                .sun-container { opacity: 0.5; }
                .sun {
                    position: absolute;
                    top: -150px;
                    left: -150px;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(ellipse at center, rgba(255,204,0,0.8) 0%,rgba(255,204,0,0) 70%);
                    border-radius: 50%;
                    animation: pulse 4s infinite;
                }
                @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }

                .clouds .cloud {
                    position: absolute;
                    background: #fff;
                    background: linear-gradient(top, #fff 5%, #f1f1f1 100%);
                    border-radius: 100px;
                    box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
                    height: 120px;
                    width: 350px;
                }
                .clouds .cloud:after, .clouds .cloud:before {
                    content: '';
                    position: absolute;
                    background: #fff;
                    z-index: -1;
                    border-radius: 200px;
                    width: 100px;
                    height: 100px;
                    right: 50px;
                    top: -50px;
                }
                 .clouds .cloud:after {
                    width: 120px; height: 120px;
                    top: -55px; left: 50px;
                }
                .x1 { top: 50px; left: 200px; transform: scale(0.3); opacity: 0.6; animation: moveclouds 25s linear infinite; }
                .x2 { top: 120px; left: 450px; transform: scale(0.6); opacity: 0.7; animation: moveclouds 20s linear infinite; }
                .x3 { top: 80px; left: -50px; transform: scale(0.4); opacity: 0.8; animation: moveclouds 30s linear infinite; }
                .x4 { top: 150px; left: 300px; transform: scale(0.5); opacity: 0.75; animation: moveclouds 18s linear infinite; }
                .x5 { top: 30px; left: 500px; transform: scale(0.35); opacity: 0.8; animation: moveclouds 22s linear infinite; }
                @keyframes moveclouds {
                    0% { margin-left: 1000px; }
                    100% { margin-left: -1000px; }
                }

                .raindrop {
                    position: absolute;
                    bottom: 100%;
                    width: 1px;
                    height: 50px;
                    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(200,220,255,0.7));
                    animation: fall linear infinite;
                }
                @keyframes fall {
                    to { transform: translateY(100vh); }
                }

            `}</style>
        </div>
    );
};

export default App;
