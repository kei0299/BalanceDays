module MetaTagsHelper
  def default_meta_tags
    {
      site: 'あなたのサイト名',
      title: 'デフォルトタイトル',
      reverse: true,
      description: 'サイトの説明',
      keywords: 'キーワード1, キーワード2',
      separator: '|',
      canonical: request.original_url,
      og: {
        title: :title,
        type: 'website',
        url: request.original_url,
        image: image_url('ogp_default.png'), # OGP 画像のデフォルト設定
        site_name: 'あなたのサイト名',
        description: :description,
        locale: 'ja_JP'
      },
      twitter: {
        card: 'summary_large_image',
        site: '@あなたのTwitterアカウント'
      }
    }
  end
end
