export interface FlatVideo {
    videoId: number;
    sectionId: number;
    orderIndex: number;
    sectionOrderIndex: number;
}

export interface Section {
    id: number;
    order_index: number;
    videos: Array<{
        id: number;
        order_index: number;
    }>;
}

/**
 * Flatten all videos in a subject into a globally ordered list.
 * Sections are sorted by order_index, videos within each section by order_index.
 */
export const flattenSubjectVideos = (sections: Section[]): FlatVideo[] => {
    const sorted = [...sections].sort((a, b) => a.order_index - b.order_index);
    const flat: FlatVideo[] = [];

    for (const section of sorted) {
        const sortedVideos = [...section.videos].sort((a, b) => a.order_index - b.order_index);
        for (const video of sortedVideos) {
            flat.push({
                videoId: video.id,
                sectionId: section.id,
                orderIndex: video.order_index,
                sectionOrderIndex: section.order_index,
            });
        }
    }

    return flat;
};

/**
 * Get previous and next video IDs for a given video in the flat list.
 */
export const getPrevNextVideoIds = (
    flatList: FlatVideo[],
    currentVideoId: number
): { prevId: number | null; nextId: number | null } => {
    const index = flatList.findIndex((v) => v.videoId === currentVideoId);

    if (index === -1) {
        return { prevId: null, nextId: null };
    }

    return {
        prevId: index > 0 ? flatList[index - 1].videoId : null,
        nextId: index < flatList.length - 1 ? flatList[index + 1].videoId : null,
    };
};

/**
 * Get the prerequisite video ID (the one immediately before this one in global order).
 * Returns null if this is the first video in the subject.
 */
export const getPrerequisiteVideoId = (
    flatList: FlatVideo[],
    videoId: number
): number | null => {
    const { prevId } = getPrevNextVideoIds(flatList, videoId);
    return prevId;
};
