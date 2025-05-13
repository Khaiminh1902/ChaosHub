import { createSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.storage.from('music').list('', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const musicFiles = await Promise.all(
    data.map(async (file) => {
      const { data: signedData, error: signedError } = await supabase.storage
        .from('music')
        .createSignedUrl(file.name, 3600);
      return {
        id: file.id,
        name: file.name,
        url: signedError ? '' : signedData.signedUrl,
      };
    })
  );

  return NextResponse.json(musicFiles.filter((file) => file.url));
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const allowedTypes = ['audio/mpeg', 'audio/wav'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only MP3 and WAV files are allowed' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Math.random().toString(36).slice(2)}.${fileExt}`;
    const supabase = await createSupabaseClient();

    const { error: uploadError } = await supabase.storage
      .from('music')
      .upload(fileName, file, {
        upsert: false,
        contentType: file.type,
        metadata: { owner_id: userId },
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('POST /api/music failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { fileName } = await request.json();
    const supabase = await createSupabaseClient();
    const { error } = await supabase.storage.from('music').remove([fileName]);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/music failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { oldName, newName, userId } = await request.json();
    const supabase = await createSupabaseClient();
    const newFileName = `${userId}/${newName}`;
    const { error } = await supabase.storage.from('music').move(oldName, newFileName);

    if (error) {
      console.error('Rename error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'File renamed successfully' });
  } catch (error) {
    console.error('PATCH /api/music failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}