<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h4>Create password for Owly</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="createPassword">
              <div class="vstack gap-2">
                <div class="form-group">
                  <label for="password">Password</label>
                  <input
                    autocomplete="new-password"
                    type="password"
                    class="form-control"
                    id="password"
                    placeholder="Enter password"
                    v-model="credentials.password"
                  />
                  <div v-for="error of v$.password.$errors" :key="error.$uid">
                    <div class="text-danger">{{ error.$message }}</div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="passwordConfirm">Confirm password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    placeholder="Confirm password"
                    v-model="credentials.passwordConfirm"
                  />
                  <div v-for="error of v$.passwordConfirm.$errors" :key="error.$uid">
                    <div class="text-danger">{{ error.$message }}</div>
                  </div>
                </div>
                <div class="text-danger" v-if="userStore.error">
                  Invalid token. Please contact your school administrator
                </div>
              </div>
              <div class="d-flex justify-content-center mt-2">
                <div v-if="userStore.loading" class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <div v-if="!userStore.loading">
                <button type="submit" class="btn btn-primary mt-3 w-100">Create password</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../../stores/user'
import { reactive, unref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'

export default {
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    const route = useRoute()

    const credentials = reactive({
      password: '',
      passwordConfirm: ''
    })

    const rules = {
      password: {
        required: helpers.withMessage(`Password cannot be empty`, required),
        minLength: helpers.withMessage(`Password must be at least 8 characters long`, minLength(8))
      },
      passwordConfirm: {
        required: helpers.withMessage(`Please confirm your password`, required),
        matchPassword: helpers.withMessage(
          'Your password confirm does not match your password',
          (value, { password }) => value === password
        )
      }
    }

    const v$ = useVuelidate(rules, credentials)

    const createPassword = async () => {
      const isFormCorrect = await unref(v$).$validate()

      if (!isFormCorrect) return

      await userStore.createUserPassword(route.query.token, credentials)

      if (!userStore.error) {
        router.push({ name: 'login' })
      }
    }

    return {
      v$,
      credentials,
      userStore,
      createPassword
    }
  }
}
</script>
