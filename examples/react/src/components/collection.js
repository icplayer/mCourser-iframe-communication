import React from 'react';
import communication from '../communication/communication';
import Loader from './loader';
import Card from '@material-ui/core/Card';
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Lesson from './lesson';
import config from '../config.json';

const useStyles = makeStyles(() =>
    createStyles({
        lessonsCard: {
            width: '50%',
            marginTop: 20
        },
        lessonsGroup: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center'
        },

        row: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            margin: 20,
            flex: '1 0 21%',
        },
        title: {
            textAlign: 'center'
        },
        content : {
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 20
        }
    }),
);

function makeChapter(lessons, chapters, chapt) {
    let toReturn = [];
    const data = {
        title: chapt.title,
        lessons: lessons.filter(lesson => lesson.chapter === chapt.id)
    }
    toReturn.push(data);

    chapters.forEach(chapter => {
        if (chapter.parent === chapt.id) {
            toReturn = toReturn.concat(makeChapter(lessons, chapters, chapter));
        }
    })

    return toReturn;
}

function Collection(props) {
    const classes = useStyles();
    const [collectionDetails, setCollectionDetails] = React.useState(null);
    React.useEffect(() => {
        communication.requestCollectionData(props.collection.id).then(function (data) {
            setCollectionDetails(data.data);
            console.log(data.data);
        });
    }, []);

    if (!collectionDetails) {
        return <Loader />
    }

    let chapters = [];
    const data = {
        title: null,
        lessons: collectionDetails.lessons.filter(lesson => !!!lesson.chapter)
    }
    chapters.push(data)
    collectionDetails.chapters.forEach((chapt) => {
        if (chapt.parent === null) {
            chapters = chapters.concat(makeChapter(collectionDetails.lessons, collectionDetails.chapters, chapt));
        }
    });

    chapters = chapters.filter(chapt => chapt.lessons.length !== 0);

    const requestCrossResource = function (definedID, originalId) {
        communication.requestCrossResource(collectionDetails.lessons[0].id, definedID, originalId);
    }

    return <div className={classes.content}>
        {chapters.map((chapter, indx) => {
            return <Card key={indx} className={classes.lessonsCard}>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {chapter.title}
                    </Typography>
                    <div className={classes.lessonsGroup}>
                        {chapter.lessons.map((lesson, lessonIndex) => {
                            return (
                                <div key={lessonIndex} className={classes.row}>
                                    <Lesson lesson={lesson} />
                                </div>
                            )
                        })}
                    </div>  
            </Card>
        })}
        <Button variant="primary" onClick={requestCrossResource.bind(null, config['CROSS_LESSON_DEFINED_ID'], config['CROSS_LESSON_COURSE_ORIGINAL_ID'])}>
            Or see previous course lesson
        </Button>
    </div>
}

export default Collection;