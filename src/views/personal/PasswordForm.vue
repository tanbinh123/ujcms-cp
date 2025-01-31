<template>
  <el-dialog
    :title="$t('changePassword')"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @opened="
      focus?.focus();
      form.resetFields();
    "
  >
    <el-form ref="form" :model="values" label-width="150px" label-position="right">
      <el-form-item
        prop="password"
        :label="$t('user.origPassword')"
        :rules="[
          { required: true, message: () => $t('v.required') },
          {
            asyncValidator: async (rule:any, value:any, callback:any) => {
              if (!(await passwordValidation(value))) {
                callback($t('user.error.passwordWrong'));
              }
            },
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="values.password" ref="focus" maxlength="50" show-password></el-input>
      </el-form-item>
      <el-form-item prop="plainPassword" :label="$t('user.newPassword')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.plainPassword" maxlength="50" show-password></el-input>
      </el-form-item>
      <el-form-item
        prop="passwordAgain"
        :label="$t('user.passwordAgain')"
        :rules="[
          { required: true, message: () => $t('v.required') },
          {
            validator: (rule:any, value:any, callback:any) => {
              if (value !== values.plainPassword) {
                callback($t('user.error.passwordNotMatch'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="values.passwordAgain" maxlength="50" show-password></el-input>
      </el-form-item>
      <div>
        <el-button :loading="buttonLoading" @click.prevent="handleSubmit" type="primary" native-type="submit">{{ $t('submit') }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { updatePassword, passwordValidation } from '@/api/personal';

defineProps({ modelValue: { type: Boolean, required: true } });
const emit = defineEmits({ 'update:modelValue': null });
const { t } = useI18n();
const values = ref<any>({});
const form = ref<any>();
const focus = ref<any>();
const buttonLoading = ref<boolean>(false);
const handleSubmit = () => {
  form.value.validate(async (valid: boolean) => {
    if (!valid) return;
    buttonLoading.value = true;
    try {
      await updatePassword(values.value);
      form.value.resetFields();
      ElMessage.success(t('success'));
      emit('update:modelValue', false);
    } finally {
      buttonLoading.value = false;
    }
  });
};
</script>
