/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSupabaseClient, getServerSupabaseAdminClient } from '@/lib/supabaseServer';
import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await getServerSupabaseClient();
    const supabaseAdmin = getServerSupabaseAdminClient();

    // Check if the user exists in Supabase, and create if not
    const { data: existingUser, error: userCheckError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('id', userId)
      .single();

    if (userCheckError && userCheckError.code !== 'PGRST116') { // PGRST116 = no rows found
      throw new Error('Failed to check Supabase user: ' + userCheckError.message);
    }

    if (!existingUser) {
      // Create the user in Supabase using the admin client
      const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        id: userId,
        email: `${userId}@yourdomain.com`, // Replace with actual email if available
        email_confirm: true,
      });

      if (createUserError || !newUser.user) {
        throw new Error('Failed to create Supabase user: ' + createUserError?.message);
      }
    }

    // Get the Supabase user ID (UUID) from the authenticated session
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Failed to get Supabase user: ' + userError?.message }, { status: 401 });
    }
    const supabaseUserId = userData.user.id; // This is the UUID

    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`; // Still use Clerk userId for file path
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload file to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from('music')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (storageError) {
      throw new Error(storageError.message);
    }

    // Get public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from('music')
      .getPublicUrl(fileName);

    // Save metadata to database using Supabase user ID (UUID)
    const { error: dbError } = await supabase
      .from('music_files')
      .insert({
        user_id: supabaseUserId,
        file_name: file.name,
        file_url: urlData.publicUrl,
      });

    if (dbError) {
      throw new Error(dbError.message);
    }

    return NextResponse.json({ message: 'File uploaded successfully', url: urlData.publicUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}