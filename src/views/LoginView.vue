<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h4>Login</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="login">
              <div class="vstack gap-2">
                <div class="form-group">
                  <label for="email">Email address</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    placeholder="Enter email"
                    v-model="state.email"
                  />
                  <div v-for="error of v$.email.$errors" :key="error.$uid">
                    <div class="text-danger">{{ error.$message }}</div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="password">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    placeholder="Enter password"
                    v-model="state.password"
                  />
                  <div v-for="error of v$.password.$errors" :key="error.$uid">
                    <div class="text-danger">{{ error.$message }}</div>
                  </div>
                </div>
                <div class="text-danger" v-if="userStore.error">
                  {{ userStore.error }}
                </div>
                <div v-if="userStore.loading" class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div v-else class="form-group">
                  <button type="submit" class="btn btn-primary mt-2">Login</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/user'
import { reactive, unref } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'

export default {
  setup() {
    const userStore = useUserStore()
    const router = useRouter()

    const state = reactive({
      email: '',
      password: ''
    })

    const rules = {
      email: {
        required: helpers.withMessage(`Email cannot be empty`, required),
        email: helpers.withMessage(`Please provide a valid email`, email)
      },
      password: {
        required: helpers.withMessage(`Password cannot be empty`, required)
      }
    }

    const v$ = useVuelidate(rules, state)

    const login = async () => {
      const isFormCorrect = await unref(v$).$validate()

      if (!isFormCorrect) return

      await userStore.login({ email: state.email, password: state.password })
      await userStore.getMe()

      if (!userStore.error) {
        router.push({ name: 'schoolProject', params: { schoolId: userStore.user.schoolId } })
      }
    }

    return {
      v$,
      state,
      userStore,
      login
    }
  }
}
</script>
