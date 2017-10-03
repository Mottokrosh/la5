<template>
  <div class="contact-form">
    <h2>Contact us</h2>

    <form action="thank-you" method="post">
      <input type="hidden" name="form-name" value="contact">

      <label>Your Name:</label><input type="text" name="name" v-model="name">

      <label>Your Email:</label><input type="email" name="email" v-model="email">

      <span hidden><label>Your URL:</label><input type="url" name="url"></span>

      <label>Message:</label><textarea name="message" v-model="message"></textarea>

      <div></div>
      <div>
        <button type="submit" :disabled="!ready">
          <mail-icon></mail-icon>
          <span>Send</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import { MailIcon } from 'vue-feather-icons';

  export default {
    components: {
      MailIcon,
    },

    data() {
      return {
        name: '',
        email: '',
        message: '',
      };
    },

    computed: {
      ready() {
        return this.name && this.email && this.message;
      },
    },
  };
</script>

<style>
  .contact-form {
    max-width: 600px;
    margin: 0 auto;

    & form {
      display: grid;
      grid-template-columns: 100px 1fr;
      grid-gap: 1rem;
    }

    & label {
      text-align: right;
      padding-top: 6px;
    }

    & input, & textarea {
      font-size: 1rem;
    }

    & textarea {
      min-height: 8em;
    }
  }
</style>