<template>
  <div class="overlay" role="dialog" aria-modal="true">
    <div class="modal">
      <h3 class="title">Log out?</h3>
      <p class="desc">You will be signed out from this device.</p>
      <div class="actions">
        <button class="btn ghost" @click="$emit('cancel')">Cancel</button>
        <button class="btn danger" @click="$emit('confirm')">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: grid;
  place-items: center;
  z-index: 50;
}
.modal {
  width: 380px;
  max-width: calc(100% - 32px);
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
.title {
  font-size: 18px;
  font-weight: 700;
  margin: 4px 0 2px;
  color: #0f172a;
}
.desc {
  font-size: 14px;
  color: #475569;
  margin-bottom: 16px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.btn {
  height: 38px;
  padding: 0 14px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
}
.btn.ghost {
  background: #fff;
  border-color: rgba(15, 23, 42, 0.15);
  color: #0f172a;
}
.btn.ghost:hover {
  background: rgba(15, 23, 42, 0.05);
}
.btn.danger {
  background: #ef4444;
  color: #fff;
}
.btn.danger:hover {
  filter: brightness(1.05);
}
</style>
