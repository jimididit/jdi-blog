<script lang="ts">
    import { onMount } from "svelte";

    
    export let slug: string = ''

    let loading: boolean = false
    let views: number = 0

    onMount(async () => {
        if(slug && slug.trim() !== '') {
            try {
                loading = true
                const url = `/api/blog/views/${slug}`
                console.log('PostStats: Fetching views from', url)
                const resp = await fetch(url)
                
                console.log('PostStats: Response status', resp.status, resp.statusText)
                console.log('PostStats: Response headers', Object.fromEntries(resp.headers.entries()))
                
                if (!resp.ok) {
                    // Try to get error details from response
                    let errorText = ''
                    try {
                        errorText = await resp.text()
                        console.error('PostStats: API error response body', errorText.substring(0, 200))
                    } catch {
                        console.error('PostStats: Could not read error response')
                    }
                    console.error('PostStats: API returned', resp.status, resp.statusText, 'for slug:', slug)
                    return
                }
                
                const contentType = resp.headers.get('content-type')
                if (!contentType || !contentType.includes('application/json')) {
                    const body = await resp.text()
                    console.error('PostStats: Expected JSON but got', contentType, 'Body:', body.substring(0, 200))
                    return
                }
                
                const stats = await resp.json()
                views = stats.views || 0
                console.log('PostStats: Successfully loaded views', views)
            } catch(e) {
                console.error('PostStats: Fetch error', e)
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

