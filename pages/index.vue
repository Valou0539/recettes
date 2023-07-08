<template>
    <div>
        <HomeCategory v-for="category in categories" 
            :key="category.id" 
            :category="category"
        />
    </div>
</template>

<script setup>
    const {data: categories} = await useFetch(`/api/get/categories`)
    
    categories.value.sort((a, b) => {
      if (a.id === 19) return 1
      if (b.id === 19) return -1
      return a.id - b.id
    })
</script>