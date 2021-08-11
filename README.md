# mCourser-iframe-communication
A simple library to simplify communication with mCourser platform.

### Installation
In case of usage of this library in a project, you can use https://www.jsdelivr.com/ It helps with providing GitHub files as CND.
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
 * init() - initialize the communication. If the communication is not initialized it is not possible to send messages into mCourser. Returns promise. As promise response returns boolean, which tells if user is authenticated
 * destroy() - destroy initialized communication. All listeners are removed. If mCourser returns data after destroy, response is not managed by communication. Does not have response.
 * updateIframeHeight(newHeight) - Set new height for embeded iframe. Does not have response.
 * requestCollectionsData() - Get all available collections for current user. Requires authenticated user. Returns a response. As the promise response returns: 
```typescript
interface ICollectionsData {
    data: {
        id: number;
        mAuthorId: number;
        title: string;
        score: number;
        errors: number;
        time: number;
        userId: number;
        userName: string;
    }[];
    type: string;
}
```
| Property name | Description |
| ------------- | ----------- |
| id            | Id of the collection. This ID is constant |
| mAuthorId     | Id of the collection received from mAuthor. This ID can be found in courses to export management on mAuthor side (in brackets)            |
| title         | The title of the collection |
| score         | The score of the student in the lessons |
| errors        | Errors of the student in the lessons |
| time          | The time spent in the lessons by the user |
| userId        | Logged in user id |
| userName      | Logged in user name|

 * requestCollectionId() - Get collection ID associated with specific custom TOC. Returns promise. As the promise response returns: 
```typescript
interface ICollectionId {
    data: {
        collectionId: number;
    };
    type: CommunicationEvent.COLLECTION_ID;
}
```

#### Collection's ID description:

| Property name                     | Description |
| ----------------------------------| ----------- |
| collectionId                      | Id of the collection associated with specific custom TOC. |

 * requestCollectionData(collectionId) - Get information about specific collection. Returns promise. As the promise response returns: 
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
                extented_metadata: [];
                tags: string;
                time: number;
                score: number;
            }[];
            chapters: {
                id: number;
                parent: number;
                title: string;
                description: string;
            }[];
            userId: number;
            userName: string;
        };
    }
```
#### Collection description:

| Property name | Description |
| ------------- | ----------- |
| id            | Id of the collection. This ID is constant |
| mAuthorId     | Id of the collection received from mAuthor. This ID can be found in courses to export management on mAuthor side (in brackets).            |
| lessons       | List of lessons in the course. See [Lessons description](#lesson-description) |
| chapters      | List of chapters in the course. See [Chapters description](#chapter-description)|
 
#### Lesson description:

| Property name      | Description |
| -------------------| ----------- |
| id                 | Id of the lesson. WARNING! This id may be changed (It is not const). Do not use it to match lessons! |
| name               | Name of the lesson. |
| type               | Type of the lesson. Available types: mauthor_lesson, mauthor_ebook, minstructor_lesson, demo_lesson, url_link, file
| chapter            | Id of the chapter where the lesson is assigned. If null, the lesson is without any chapter |
| icon               | Icon URL of the lesson. Warning! The icon URL is in format: "/file/serve/[id]" |
| description        | Description of the lesson extracted from the lesson definition. |
| definedId          | The defined ID of the lesson. This id is defined on mAuthor side in a metadata definition. It's preferred way to match specific lesson. |
| errors             | Number of errors which have been received by the user. |
| extended_metadata  | Lesson's metadata containing i.e. lesson_category. |
| tags               | String with comma separated tags associated with specific lesson, i.e. school_grade, subject |
| time               | How long the user spent in the lesson. |
| score              | The score which have been received by the user. |

#### Chapter description:

| Property name | Description |
| ------------- | ----------- |
| id            | Id of the chapter. This id may be changed. |
| parent        | Parent chapter for this chapter. If empty, chapter do not have parent. |
| title         | The title of the chapter. |
| description   | The description of the chapter. |

#### User description:

| Property name | Description |
| ------------- | ----------- |
| userId        | Logged in user id |
| userName      | Logged in user name|


 * requestCollectionDataByURL(publisherURL, collectionURL) - Get public information about collection by collection and publisher URLs. Returns promise.
     * publisherURL - URL of the publisher defined on mCourser. Publisher URL is available in mCourser publisher panel, in publisher configuration (URL address input). 
     * collectionURL - URL of the collection. This address is available in collections management. In specific course management there is available adress URL input.
     
 As promise responses:
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
            id: number;
            parent: number;
            title: string;
            description: string;
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
 
 * requestCollectionExternalResources() - get external resources associated with specific collection. Returns promise. As the promise response returns:
```typescript
interface ICollectionExternalResources {
    type: CommunicationEvent.COLLECTION_EXTERNAL_RESOURCES;
    data: {
        courseId: number;
        externalResources: {
            course: number;
            course_external_id: string;
            cover: string;
            external_id: string;
            label: string;
            url: string;
        }[] | [];
    };
}
```

#### Collection's external resources description:

| Property name     | Description |
| ------------------| ----------- |
| courseId          | Id of the collection. |
| externalResources | External resources associated with specific collection. See [External resource](#external-resource-description). |


#### External resource description:

| Property name      | Description |
| -------------------| ----------- |
| course             | Id of the collection. |
| course_external_id | External id of the course.  |
| cover              | External resource's cover (in form of an URL). |
| external_id        | External resource's external id. |
| label              | External resource's label. |
| url                | External resource's URL. |

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
 * requestCollectionCustomTOCFirstVisitDate(collectionId) - Get specific collection's custom TOC first visit date. Returns promise. As the promise response returns:
```typescript
interface ICollectionCustomTOCFirstVisitDate {
    type: CommunicationEvent.COLLECTION_CUSTOM_TOC_FIRST_VISIT_DATE_DATA;
    data: {
        id: number;
        collectionCustomTOCFirstVisitDate: string;
    };
}
```
#### Collection's custom TOC first visit date description:

| Property name                     | Description |
| ----------------------------------| ----------- |
| id                                | Id of the collection. |
| collectionCustomTOCFirstVisitDate | Date of collection's custom TOC first visit by the logged-in user. |

* postCollectionCustomTOCFirstVisitDate(collectionId) - Post and return specific collection's custom TOC first visit date. Returns promise. As the promise response returns:
```typescript
interface ICollectionCustomTOCFirstVisitDate {
    type: CommunicationEvent.COLLECTION_CUSTOM_TOC_FIRST_VISIT_DATE_DATA;
    data: {
        id: number;
        collectionCustomTOCFirstVisitDate: string;
    };
}
```

 * requestCollectionCustomTOCAndAnyLessonLastVisitsDates(collectionId) - Get specific collection's custom TOC and specific collection's any lesson last visits dates. Returns promise. As the promise response returns:
```typescript
interface ICollectionCustomTOCAndAnyLessonLastVisitsDates {
    type: CommunicationEvent.COLLECTION_CUSTOM_TOC_AND_ANY_LESSON_LAST_VISITS_DATES_DATA;
    data: {
        id: number;
        collectionCustomTOCLastVisitDate: string;
        collectionAnyLessonLastVisitDate: string;
    };
}
```
#### Collection's custom TOC and any lesson last visits dates description:

| Property name                     | Description |
| --------------------------------- | ----------- |
| id                                | Id of the collection. |
| collectionCustomTOCLastVisitDate  | Date of collection's custom TOC last visit by the logged-in user. |
| collectionAnyLessonLastVisitDate  | Date of collection's any lesson last visit by the logged-in user. |

 * postCollectionCustomTOCLastVisitDate(collectionId) - Post specific collection's custom TOC and return specific collection's custom TOC and any lesson last visits dates. Returns promise. As the promise response returns:
```typescript
interface ICollectionCustomTOCAndAnyLessonLastVisitsDates {
    type: CommunicationEvent.COLLECTION_CUSTOM_TOC_AND_ANY_LESSON_LAST_VISITS_DATES_DATA;
    data: {
        id: number;
        collectionCustomTOCLastVisitDate: string;
        collectionAnyLessonLastVisitDate: string;
    };
}
```
For parameters description see [Collection's custom TOC and any lesson last visits dates description](#Collection's custom TOC and any lesson last visits dates description:).

* requestCollectionCustomTOCState(collectionId) - Get specific collection's custom TOC state. Returns promise. As the promise response returns:
```typescript
interface ICollectionCustomTOCState {
    type: CommunicationEvent.COLLECTION_CUSTOM_TOC_STATE_DATA;
    data: {
        id: number;
        collectionCustomTOCState: string;
    };
}
```
#### Collection's custom TOC state description:

| Property name                     | Description |
| ----------------------------------| ----------- |
| id                                | Id of the collection. |
| collectionCustomTOCState          | State of collection's custom TOC associated with the logged-in user. |

* postCollectionCustomTOCState(collectionId) - Post and return specific collection's custom TOC state. Returns promise. As the promise response returns:
```typescript
interface ICollectionCustomTOCState {
    type: CommunicationEvent.COLLECTION_CUSTOM_TOC_STATE_DATA;
    data: {
        id: number;
        collectionCustomTOCState: string;
    };
}
```

#### Collection's custom TOC state description:

| Property name                     | Description |
| ----------------------------------| ----------- |
| id                                | Id of the collection. |
| collectionCustomTOCState          | State of collection's custom TOC associated with the logged-in user. |

* requestCollectionLessonsPaginatedResults(collectionId) - Get information about specific collection lessons paginated results. Returns promise. As the promise response returns:
```typescript
interface ICollectionLessonsPaginatedResultsData {
    type: CommunicationEvent.COLLECTION_LESSONS_PAGINATED_RESULTS_DATA;
    data: {
        id: number;
        lessonsPaginatedResults: LessonsPaginatedResultsData[];
    };
}
```
The ILessonPaginatedResultsData interface has a following from:
```typescript
interface ILessonPaginatedResultsData {
    type: CommunicationEvent.COLLECTION_LESSONS_PAGINATED_RESULTS_DATA;
    data: {
        lessonID: number;
        lessonPaginatedResults: [];
    };
}
```

#### Collection lessons paginated results description:

| Property name           | Description |
| -------------           | ----------- |
| id                      | Id of the collection. |
| lessonsPaginatedResults |List of lessons with paginated results scored by the logged-in user. See [Lessons paginated resutls description](#lessons-paginated-results-description).            |
 
#### Lesson paginated results description:

| Property name          | Description |
| -------------          | ----------- |
| lessonID               | Id of the lesson.|
| lessonPaginatedResults | List paged with results scored by the logged-in user. |


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
