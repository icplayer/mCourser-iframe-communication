import React from 'react';
import communication from '../communication/communication';
import ImageGallery from 'react-image-gallery';
import Loader from './loader';
import Typography from '@material-ui/core/Typography';
import config from '../config.json';
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
    createStyles({
        gallery: {
            maxHeight: "80%",
            width: "100%",
            height: "80%",
            overflow: "none",
            display: "flex",
            justifyContent: "center",
            marginBottom: 20,
            flexWrap: 'wrap'
        }
    }),
);

function CollectionNotFound () {
    const classes = useStyles();
    const [collectionDetails, setCollectionDetails] = React.useState(null);
    React.useEffect(() => {
        communication.requestCollectionDataByURL(config['PUBLIC_PUBLISHER_URL'], config['PUBLIC_COURSE_URL']).then(function (data) {
            setCollectionDetails(data.data);
            console.log('Public data', data.data);
        });
    }, []);

    if (!collectionDetails) {
        return <Loader />
    }
    
    const images = collectionDetails.screenShots.map(el => ({
        original: `${config['APPLICATION_BASE_URL']}${el}`,
        thumbnail: `${config['APPLICATION_BASE_URL']}${el}`
    }))
    return <div className={classes.gallery}>
        <Typography dangerouslySetInnerHTML={{__html: collectionDetails.screenShotsDescription}}>
        </Typography>
        <ImageGallery items={images} showFullscreenButton={false} showPlayButton={false} autoPlay={true} showNav={false} />
    </div>
}

export default CollectionNotFound;