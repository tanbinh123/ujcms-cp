<template>
  <div>
    <div class="p-3 app-block">
      <el-form label-width="200px">
        <el-form-item>
          <template #label><label-tip message="generator.fulltext" /></template>
          <el-button :disabled="perm('generator:fulltext:reindexAll')" :loading="buttonLoading" @click.prevent="handleFulltextReindexAll" type="primary" plain>
            {{ $t('generator.op.fulltext.reindexAll') }}
          </el-button>
          <el-button
            v-if="isInclude('generator:fulltext:reindexSite')"
            :disabled="perm('generator:fulltext:reindexSite')"
            :loading="buttonLoading"
            @click.prevent="handleFulltextReindexSite"
            type="primary"
            plain
          >
            {{ $t('generator.op.fulltext.reindexSite') }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <template #label><label-tip message="generator.html" /></template>
          <el-button :disabled="perm('generator:html')" :loading="buttonLoading" @click.prevent="handleHtmlAll" type="primary" plain>
            {{ $t('generator.op.html.all') }}
          </el-button>
          <span class="mx-2">|</span>
          <el-button :disabled="perm('generator:html')" :loading="buttonLoading" @click.prevent="handleHtmlHome" type="primary" plain>
            {{ $t('generator.op.html.home') }}
          </el-button>
          <el-button :disabled="perm('generator:html')" :loading="buttonLoading" @click.prevent="handleHtmlChannel" type="primary" plain>
            {{ $t('generator.op.html.channel') }}
          </el-button>
          <el-button :disabled="perm('generator:html')" :loading="buttonLoading" @click.prevent="handleHtmlArticle" type="primary" plain>
            {{ $t('generator.op.html.article') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="mt-3 p-3 app-block">
      <div class="pb-2 border-b text-gray-primary">{{ $t('site.settings.html') }}</div>
      <el-form class="mt-3" ref="form" :model="values" v-loading="loading" :disabled="perm('siteSettings:html:update')" label-width="200px">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="enabled" :rules="{ required: true, message: () => $t('v.required') }">
              <template #label><label-tip message="site.html.enabled" /></template>
              <el-switch v-model="values.enabled" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="auto" :rules="{ required: true, message: () => $t('v.required') }">
              <template #label><label-tip message="site.html.auto" /></template>
              <el-switch v-model="values.auto" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="channel" :rules="{ required: true, message: () => $t('v.required') }">
              <template #label><label-tip message="site.html.channel" /></template>
              <el-input v-model="values.channel" maxlength="100"><template #append>.html</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="article" :rules="{ required: true, message: () => $t('v.required') }">
              <template #label><label-tip message="site.html.article" /></template>
              <el-input v-model="values.article" maxlength="100"><template #append>.html</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="listPages" :rules="{ required: true, message: () => $t('v.required') }">
              <template #label><label-tip message="site.html.listPages" /></template>
              <el-select v-model="values.listPages" placeholder="Select">
                <el-option
                  v-for="item in [
                    { label: '1', value: 1 },
                    { label: '3', value: 3 },
                    { label: '10', value: 10 },
                    { label: '100', value: 100 },
                    { label: '1000', value: 1000 },
                    { label: '全部', value: 2147483647 },
                  ]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <el-button :disabled="perm(`siteSettings:html:update`)" @click.prevent="handleSubmit" type="primary" native-type="submit">
            {{ $t('submit') }}
          </el-button>
        </div>
      </el-form>
    </div>
    <div class="mt-3 p-3 app-block">
      <div class="text-gray-primary">{{ $t('generator.taskList') }}</div>
    </div>
    <task-list ref="taskListRef" class="mt-3" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { ElForm } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { querySiteHtmlSettings, updateSiteHtmlSettings } from '@/api/config';
import { fulltextReindexAll, fulltextReindexSite, htmlAll, htmlHome, htmlChannel, htmlArticle } from '@/api/content';
import { perm, isInclude } from '@/store/useCurrentUser';
import LabelTip from '@/components/LabelTip.vue';
import TaskList from '@/views/system/TaskList.vue';

type FormInstance = InstanceType<typeof ElForm>;
const { t } = useI18n();
const form = ref<FormInstance>();
const values = ref<any>({});
const loading = ref<boolean>(false);
const buttonLoading = ref<boolean>(false);
const taskListRef = ref<any>();

const fetchSiteSetting = async () => {
  values.value = await querySiteHtmlSettings();
};

onMounted(async () => {
  loading.value = true;
  try {
    await fetchSiteSetting();
  } finally {
    loading.value = false;
  }
});

const handleFulltextReindexAll = async () => {
  buttonLoading.value = true;
  try {
    await fulltextReindexAll();
    await taskListRef.value.fetchData();
    ElMessage.success(t('success'));
  } finally {
    buttonLoading.value = false;
  }
};
const handleFulltextReindexSite = async () => {
  buttonLoading.value = true;
  try {
    await fulltextReindexSite();
    await taskListRef.value.fetchData();
    ElMessage.success(t('success'));
  } finally {
    buttonLoading.value = false;
  }
};
const handleHtmlAll = async () => {
  buttonLoading.value = true;
  try {
    await htmlAll();
    await taskListRef.value.fetchData();
    ElMessage.success(t('success'));
  } finally {
    buttonLoading.value = false;
  }
};
const handleHtmlHome = async () => {
  buttonLoading.value = true;
  try {
    await htmlHome();
    ElMessage.success(t('success'));
  } finally {
    buttonLoading.value = false;
  }
};
const handleHtmlChannel = async () => {
  buttonLoading.value = true;
  try {
    await htmlChannel();
    await taskListRef.value.fetchData();
    ElMessage.success(t('success'));
  } finally {
    buttonLoading.value = false;
  }
};
const handleHtmlArticle = async () => {
  buttonLoading.value = true;
  try {
    await htmlArticle();
    await taskListRef.value.fetchData();
    ElMessage.success(t('success'));
  } finally {
    buttonLoading.value = false;
  }
};
const handleSubmit = () => {
  if (!form.value) return;
  form.value.validate(async (isValid?: boolean) => {
    if (!isValid) return;
    loading.value = true;
    try {
      await updateSiteHtmlSettings(values.value);
      await htmlAll();
      await taskListRef.value.fetchData();
      ElMessage.success(t('success'));
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style lang="scss" scoped></style>
