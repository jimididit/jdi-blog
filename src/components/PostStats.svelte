<script lang="ts">
    import { onMount } from "svelte";

    
    export let slug: string = ''

    let loading: boolean = false
    let views: number = 0

    onMount(async () => {
        if(slug && slug.trim() !== '') {
            try {
                loading = true
                const resp = await fetch(`/api/blog/views/${slug}.json`)
                
                if (!resp.ok) {
                    console.error('PostStats: API returned', resp.status, resp.statusText)
                    return
                }
                
                const contentType = resp.headers.get('content-type')
                if (!contentType || !contentType.includes('application/json')) {
                    console.error('PostStats: Expected JSON but got', contentType)
                    return
                }
                
                const stats = await resp.json()
                views = stats.views || 0
            } catch(e) {
                console.error('PostStats', e)
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

