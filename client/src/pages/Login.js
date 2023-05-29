import React from "react";

export default function Login() {
  return (
    <div className="form-page">
      <div class="form-block">
        <img src="http://www.androidpolice.com/wp-content/themes/ap2/ap_resize/ap_resize.php?src=http%3A%2F%2Fwww.androidpolice.com%2Fwp-content%2Fuploads%2F2015%2F10%2Fnexus2cee_Search-Thumb-150x150.png&w=150&h=150&zc=3" />

        <input type="email" name="email" placeholder="Email" />

        <input type="password" name="Password" placeholder="Password" />

        <button>Sign in</button>

        <a href="https://www.google.com/">Create account</a>
      </div>
    </div>
  );
}
