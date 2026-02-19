<script lang="ts">
    import { onMount } from "svelte";

    
    export let slug: string = ''

    let loading: boolean = false
    let views: number = 0

    onMount(async () => {
        if(slug && slug.trim() !== '') {
            try {
                loading = true
                const resp = await fetch(`/api/views?slug=${encodeURIComponent(slug)}`)
                
                if (!resp.ok) {
                    console.error('PostStats: Failed to fetch views', resp.status)
                    return
                }
                
                const stats = await resp.json()
                views = stats.views || 0
            } catch(e) {
                console.error('PostStats: Error fetching views', e)
            } finally {
                loading = false
            }
        }
    })
</script>
<span class="post-stats__views">{ views } views</span>
<style>
    .post-stats__views {
        @apply px-1 mx-1;
    }
</style>

