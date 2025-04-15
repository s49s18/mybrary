FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)

FilePond.setOptions({
    stylePanelAspectRatio: 2 / 1.5,
    imageResizeTargetWidth: 150,
    imageResizeTargetHeight: 200,
    imageResizeMode: 'contain'
})

FilePond.parse(document.body); // we parse all fileUploads to filepond Objects