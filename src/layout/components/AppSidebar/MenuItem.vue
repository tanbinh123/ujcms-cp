<template>
  <template v-if="isShow">
    <el-sub-menu v-if="subMenu" :index="resolvePath(path)" popper-append-to-body>
      <template #title>
        <el-icon v-if="icon"><component :is="icon"></component></el-icon>
        <span>{{ $t(title) }}</span>
      </template>
      <menu-item v-for="item in route.children.filter((item:any) => isShowMenu(item))" :key="item.path" :route="item" :base-path="resolvePath(item.path)" />
    </el-sub-menu>
    <el-menu-item v-else :index="resolvePath(path)" @click="handleClick">
      <el-icon v-if="icon"><component :is="icon"></component></el-icon>
      <template #title>
        <span>{{ $t(title) }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { computed, defineProps, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { isShowMenu } from '@/store/useCurrentUser';

function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path);
}

const props = defineProps({ route: { type: Object, required: true }, basePath: { type: String, default: '' } });
const { route, basePath } = toRefs(props);
const router = useRouter();
const { t } = useI18n();

// 是否显示。非隐藏路由即显示
const isShow = computed(() => !route.value.meta?.hidden);
// 是否子菜单。有标题且有子元素即为子菜单
const subMenu = computed(() => route.value.meta?.title && route.value.children);
// 目标路由。如果自己没有title，且有子元素，则子元素为目标路由
const targetRoute = computed(() => (!route.value.meta?.title && route.value.children?.length > 0 ? route.value.children[0] : route.value));
const icon = computed(() => targetRoute.value.meta?.icon);
const title = computed(() => targetRoute.value.meta?.title);
// 路由路径。如果targetItem是子元素，则使用子元素路由；使用自己的路由，则为空串，因为在basePath中已经指定了自己的路由
const path = computed(() => (route.value !== targetRoute.value ? targetRoute.value.path : ''));

const resolvePath = (routePath: string) => {
  if (isExternal(routePath)) {
    return routePath;
  }
  return `${basePath.value}/${routePath}`;
};
const handleClick = () => {
  const fullPath = resolvePath(path.value);
  if (isExternal(fullPath)) {
    window.open(fullPath, '_blank');
  } else {
    router.push(resolvePath(path.value));
  }
};
</script>
