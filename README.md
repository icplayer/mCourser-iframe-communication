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
 * destroy() - destroy initialized communication. All listeners are removed. If mCourser returns data after destroy it will not be managed by communication. Does not have response.
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
| Property name | Description |
| ------------- | ----------- |
| id            | Id of the collection. This ID is const per collection |
| mAuthorId     | Id of the collection received from mAuthor. This ID can be found in courses to export management on mAuthor side (in brackets)            |
| title         | Title of the collection |
| score         | Score received by student in the lessons |
| errors        | Errors received by student in the lessons |
| time          | Time spent in the lessons by student |

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
#####Collection description:

| Property name | Description |
| ------------- | ----------- |
| id            | Id of the collection. This ID is const per collection |
| mAuthorId     | Id of the collection received from mAuthor. This ID can be found in courses to export management on mAuthor side (in brackets)            |
| lessons       | List of lessons in the course. See [Lessons description](#lesson-description) |
| chapters      | List of chapters in the course. See [Chapters description](#chapter-description)|
 
#####Lesson description:

| Property name | Description |
| ------------- | ----------- |
| id            | Id of the lesson. WARNING! This id may be changed (It is not const). Do not use it to match lessons! |
| name          | Name of the lesson. |
| type          | Type of the lesson. Available types: mauthor_lesson, mauthor_ebook, minstructor_lesson, demo_lesson, url_link, file
| chapter       | Id of chapter where lesson is assigned. If null, lesson is without chapter |
| icon          | Icon URL of the lesson. Warning! Icon is in format: "/file/serve/[id]" |
| description   | Description of the lesson extracted from the lesson definition. |
| definedId     | Defined ID of the lesson. This id is defined on mAuthor side in metadata definition. It's preferred way to match specific lesson. |
| errors        | Number of errors which have been received by user. |
| time          | How long user spent in the lesson. |
| score         | Score which have been received by user. |

#####Chapter description

| Property name | Description |
| ------------- | ----------- |
| id            | Id of the chapter. This id may be changed. |
| parent        | Parent chapter for this chapter. If empty, chapter do not have parent. |
| title         | Title of the chapter. |
| description   | Description of the chapter. |

 * requestCollectionDataByURL(publisherURL, collectionURL) - Get public information about collection by collection and publisher URLs. Returns promise.
     * publisherURL - URL of the publisher defined on mCourser. Publisher URL is available in mCourser publisher panel, in publisher configuration (URL address input). 
     * collectionURL - URL of the collection. This address is available in collections management. In specific course management there is available adress URL input.
     
 As promise reponses:
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

Because this API is available for anonymous users, there is no information about score, time etc.

| Property name             | Description |
| ------------------------- | ----------- |
| id                        | Id of the collection. |
| mAuthorId                 | Collection id defined on mAuthor side. See [Collection description:](#collection-description) for more information. |
| collectionURL             | Collection URL See method definition for more information |
| publisherURL              | Publisher URL. See method definition for more information. |
| sampleLessons             | List of samples lessons. Most of properties match [Lesson description](#lesson-description) |
| sampleLessonsDescription  | Description of samples lessons. |
| screenShots               | List of screenshots added to the course. Warning: these URLS are in format: "/file/serve/[id]" |
| screenShotsDescription    | Description of the screenshots added to the course |
| lessons                   | List of lessons. Most of properties match [Lesson description](#lesson-description). |
| chapters                  | See [Chapters description](#chapter-description) for chapters dict information |

 * requestCrossResource(resourceId, definedId, mAuthorCourseId, pageId, lessonType) - Open new lesson from different or the same course. 
   * Resource id is any lesson id in selected publisher. It means that you need to retrieve at least one lesson from the API in case of cross lesson request.
   If course ID is set, this parameter is also required, additionally lesson publisher == course publisher.
   Remember, course id is const, but lesson id may be changed when course is re-imported.
   * definedId is id defined on mAuthor for specific lesson. See [Lessons description](#lesson-description).
   * mAuthorCourseId is id of course on mAuthor. This argument is optional. See [Collection description:](#collection-description) 
   * pageId is page id visible in mAuthor lesson editor. This argument is optional. 
   * lessonType - lesson can be 'ebook' type or 'lesson' type. 'lesson' is set as default. 
   
   This method does not return data. User may not have access to selected lesson. If courseId is not set, lesson is selected relative to resourceId.
 * requestLoginView() - Open login view in mCourser Application.
 * requestOpenLesson(lessonId) - open lesson by lesson id field. This method does not return data. Remember, lesson id may be changed for example when the course is re-imported.

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
