import "./LoginModal.css";

function LoginModal() {
  return (
    <div className="login-overlay">
      <div className="login-modal">
        <div className="login-header">
          <h2>ĐĂNG NHẬP HOẶC TẠO TÀI KHOẢN</h2>
          <span className="close-btn">×</span>
        </div>

        <div className="login-body">
          <div className="login-link">
            <a href="/">Đăng nhập bằng số điện thoại</a>
          </div>

          <div className="input-group">
            <input type="text" placeholder="Email" className="input" />
          </div>

          <div className="input-group">
            <input type="password" placeholder="Mật khẩu" className="input" />
            <span className="eye-icon">👁</span>
          </div>

          <div className="forgot">
            <a href="/">Quên mật khẩu email?</a>
          </div>

          <button className="login-btn">ĐĂNG NHẬP</button>

          <div className="divider">
            <span>hoặc đăng nhập bằng</span>
          </div>

          <div className="social">
            <button className="google">G+ Google</button>
            <button className="facebook">f Facebook</button>
          </div>

          <p className="register">
            Bạn chưa có tài khoản? <a href="/">Đăng ký ngay!</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
