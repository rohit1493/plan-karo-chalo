import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { stageId, optionId, memberId } = await req.json()

    if (!stageId || !optionId || !memberId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 1. Validate: member must have planner role
    const { data: member, error: memberError } = await adminClient
      .from('members')
      .select('role, trip_id')
      .eq('id', memberId)
      .single()

    if (memberError || !member) {
      return new Response(JSON.stringify({ error: 'Member not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!['primary_planner', 'secondary_planner'].includes(member.role)) {
      return new Response(JSON.stringify({ error: 'Only planners can lock stages' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Validate: stage exists and is not already locked
    const { data: stage, error: stageError } = await adminClient
      .from('stages')
      .select('*')
      .eq('id', stageId)
      .eq('trip_id', member.trip_id)
      .single()

    if (stageError || !stage) {
      return new Response(JSON.stringify({ error: 'Stage not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (stage.is_locked) {
      return new Response(JSON.stringify({ error: 'Stage already locked' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Lock the stage
    const { error: lockError } = await adminClient
      .from('stages')
      .update({
        is_locked: true,
        locked_option_id: optionId,
        locked_at: new Date().toISOString(),
      })
      .eq('id', stageId)

    if (lockError) throw lockError

    // 4. Advance current_stage and check if confirmed
    const newStageIndex = stage.order + 1
    const isConfirmed = newStageIndex >= 4

    const { error: tripError } = await adminClient
      .from('trips')
      .update({
        current_stage: Math.min(newStageIndex, 3),
        status: isConfirmed ? 'confirmed' : 'planning',
        updated_at: new Date().toISOString(),
      })
      .eq('id', member.trip_id)

    if (tripError) throw tripError

    return new Response(
      JSON.stringify({ success: true, confirmed: isConfirmed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
