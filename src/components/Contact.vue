<template>
  <div class="contact-form">
    <h2>Contact us</h2>

    <form name="contact" action="thank-you" netlify>
      <label>Your Name:</label><input type="text" name="name">
      <label>Your Email:</label><input type="email" name="email">
      <label>Message:</label><textarea name="message"></textarea>
      <div></div><div><button type="submit">Send</button></div>
    </form>
  </div>
</template>

<style>
  .contact-form {
    & label {
      text-align: right;
      padding-top: 4px;
    }

    & input, & textarea {
      font-size: 1rem;
    }

    & textarea {
      min-height: 8em;
    }
  }
</style>