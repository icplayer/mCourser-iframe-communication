# mCourser-iframe-communication
Simple library to simplify communication with mCourser platform.

### Installation
If you want to use this library in custom table of content, use https://www.jsdelivr.com/ application. It provides CDN for github files.
#### Example:
```HTML
<script src="https://cdn.jsdelivr.net/gh/icplayer/mCourser-iframe-communication/index.js"></script>
```
Or for minified version:
```HTML
<script src="https://cdn.jsdelivr.net/gh/icplayer/mCourser-iframe-communication/index.min.js"></script>
```

Note that, this is latest version of library. It may provide compatibility issues in the future. For more information about serving specific version see: https://www.jsdelivr.com/features

### Supported commands:
 * init() - initialize communication. If communication is not initialized it is not possible to communicate. Returns promise. As promise response returns boolean, which tells if user is authenticated
 * destoy() - destroy initialized communication. All listeners are removed. If mCourser returns data after destroy it will not be managed by communication. Does not have response.
 * updateIframeHeight(newHeight) - Set new height for embeded iframe. Does not have response.
 * requestCollectionsData() - Get all available collections for current user. Requires authenticated user. Returns response. As promise response returns: 
```typescript
interface ICollectionsData {
    data: {
        id: number;
        mAuthorId: number;
        title: string;
        score: number;
        errors: number;
        time: number;
    }[];
    type: string;
}
```
 * requestCollectionData(collectionId) - Get information about specific collection. Returns promise. As promise response returns: 
```typescript
interface ICollectionData {
        type: string;
        data: {
            id: number;
            mAuthorId: number;
            lessons: {
                id: string;
                name: string;
                type: 'mauthor_lesson' |'mauthor_ebook' | 'minstructor_lesson' | 'demo_lesson' | 'url_link' | 'file';
                chapter: number | null;
                icon: string;
                description: string;
                definedId: string;
                errors: number;
                time: number;
                score: number;
            }[];
            chapters: {
                id: number,
                parent: number,
                title: string,
                description: string
            }[];
        };
    }
```
 * requestCollectionDataByURL(publisherURL, collectionURL) - Get public information about collection by collection and publisher URLs. Returns promise. As promise reponses:
```typescript
interface IPublicCollectionData {
    type: string;
    data: {
        id: number;
        mAuthorId: number;
        collectionURL: string;
        publisherURL: string;
        sampleLessons: {
            id: number;
            icon: string;
            title: string;
            description: string;
            type: 'mauthor_lesson' |'mauthor_ebook' | 'minstructor_lesson' | 'demo_lesson' | 'url_link' | 'file';
        }[];
        sampleLessonsDescription: string;
        screenShots: string[];
        screenShotsDescription: string;
        lessons: {
            name: string;
            type: 'mauthor_lesson' |'mauthor_ebook' | 'minstructor_lesson' | 'demo_lesson' | 'url_link' | 'file';
            chapter: number | null;
            icon: string;
            description: string;
            definedId: string;
        }[];
        chapters: {
            id: number,
            parent: number,
            title: string,
            description: string
        }[];
    };
}
```
 * requestCrossResource(resourceId, lessonId, courseId, pageId, lessonType) - Open new lesson from different course. Resource id is any id of lesson in selected publisher. lessonId is id defined on mAuthor for specific lesson. courseId is id of course on mAuthor. This argument is optional. pageId is id from editor. This argument is optional. lessonType - lesson can be 'ebook' type or 'lesson' type. 'lesson' is set as default. This method does not return data. User may not have access to selected lesson. If courseId is not set, lesson is selected relative to resourceId.
 * requestLoginView() - Open login view in mCourser Application.
 * requestOpenLesson(lessonId) - open lesson by lesson id field. This method does not return data.

 ### Example usage:
 ```Javascript
 var communication = new MCourserCommunication();
 communication.init().then(function (isAuth) {
     if (!isAuth) {
         renderExamplesPage();
     } else {
         communication.requestCollectionsData().then(function (collections) {
             renderCollection(collections);
         });
     }
 });
 ```

 For more usage see examples directory.
