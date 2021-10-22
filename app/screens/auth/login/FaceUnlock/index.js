import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {showMessage} from "../../../../helpers/toast";
import connect from "react-redux/es/connect/connect";
import {faceLoginProcess, getUserProcess} from "../../../../actions/auth";
import styles from "./style";
import {NavigationActions} from "react-navigation";
import Spinner from "../../../../components/spinner";

const landmarkSize = 2;

class FaceUnlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flash: 'auto',
            autoFocus: 'on',
            depth: 0,
            type: 'front',
            faces: [],
            isLoading: false,
            isRecognized: false,
            count: 0
        };
    }

    takePicture = async () => {
        if (this.camera && !this.state.isLoading) {
            this.setState({isLoading: true, isRecognized: true});
            const options = {width: 500, height: 500, quality: 0.8, base64: true};
            const data = await this.camera.takePictureAsync(options);
            this.props.onFaceLogin({image: 'data:image/jpeg;base64,' + data.base64}).then(result => {
                if (result) {
                    this.getUserData();
                }
            }).catch(error => {
                if (this.state.count < 4) {
                    this.setState({isLoading: false, count: this.state.count + 1, isRecognized: false});
                } else {
                    Alert.alert(
                        'Authentication Failed!!',
                        'Do You Want to Try Again?',
                        [
                            {text: 'No, Cancel', style: 'cancel'},
                            {
                                text: 'Yes',
                                onPress: () => this.setState({isLoading: false, count: 0, isRecognized: false})
                            },
                        ],
                        {cancelable: false}
                    );
                }
            })
        }
    };

    async getUserData() {
        let user = await this.props.getUser().catch(() => {
            this.setState({isLoading: false});
        });
        if (!user) return;
        if (user) {
            this.props.navigation.dispatch(NavigationActions.popToTop());
            this.props.navigation.navigate('Download');
            this.setState({isLoading: false});
        }
    }

    onFacesDetected = ({faces}) => {
        this.setState({faces});
        if (!this.state.isLoading && !this.state.isRecognized) {
            this.takePicture();
        }
    };

    onFaceDetectionError = state => showMessage('Faces detection error:', state);

    renderFace({bounds, faceID, rollAngle, yawAngle}) {
        return (
            <View
                key={faceID}
                transform={[
                    {perspective: 600},
                    {rotateZ: `${rollAngle.toFixed(0)}deg`},
                    {rotateY: `${yawAngle.toFixed(0)}deg`},
                ]}
                style={[
                    styles.face,
                    {
                        ...bounds.size,
                        left: bounds.origin.x,
                        top: bounds.origin.y,
                    },
                ]}
            >
                <Text style={styles.faceText}>ID: {faceID}</Text>
                <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
                <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
            </View>
        );
    }

    renderLandmarksOfFace(face) {
        const renderLandmark = position =>
            position && (
                <View
                    style={[
                        styles.landmark,
                        {
                            left: position.x - landmarkSize / 2,
                            top: position.y - landmarkSize / 2,
                        },
                    ]}
                />
            );
        return (
            <View key={`landmarks-${face.faceID}`}>
                {renderLandmark(face.leftEyePosition)}
                {renderLandmark(face.rightEyePosition)}
                {renderLandmark(face.leftEarPosition)}
                {renderLandmark(face.rightEarPosition)}
                {renderLandmark(face.leftCheekPosition)}
                {renderLandmark(face.rightCheekPosition)}
                {renderLandmark(face.leftMouthPosition)}
                {renderLandmark(face.mouthPosition)}
                {renderLandmark(face.rightMouthPosition)}
                {renderLandmark(face.noseBasePosition)}
                {renderLandmark(face.bottomMouthPosition)}
            </View>
        );
    }

    renderFaces() {
        return (
            <View style={styles.facesContainer} pointerEvents="none">
                {this.state.faces.map(this.renderFace)}
            </View>
        );
    }

    renderLandmarks() {
        return (
            <View style={styles.facesContainer} pointerEvents="none">
                {this.state.faces.map(this.renderLandmarksOfFace)}
            </View>
        );
    }

    renderCamera() {
        return (
            <RNCamera
                ref={ref => {
                    this.camera = ref;
                }}
                style={{
                    flex: 1,
                }}
                type={this.state.type}
                flashMode={this.state.flash}
                autoFocus={this.state.autoFocus}
                faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
                onFacesDetected={this.onFacesDetected}
                // onFacesDetected={this.takePicture.bind(this)}
                onFaceDetectionError={this.onFaceDetectionError}
                focusDepth={this.state.depth}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    alignSelf: 'center',
                    justifyContent: 'flex-end'
                }}>
                    {
                        this.state.isLoading ?
                            <View style={{
                                backgroundColor: '#FFF',
                                width: 200,
                                height: 200,
                                justifyContent: 'center',
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: '#fff'
                            }}>
                                <ActivityIndicator color={'#00897B'}
                                                   size={'large'}
                                                   style={{marginBottom: 20}}
                                />
                                <Text
                                    style={{textAlign: 'center', fontSize: 18, color: '#00897B'}}>{'Loading...'}</Text>
                            </View>
                            : null
                    }
                </View>
                {this.renderFaces()}
                {this.renderLandmarks()}
            </RNCamera>
        );
    }

    render() {
        return <View style={styles.container}>{this.renderCamera()}</View>;
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
});

const mapDispatchToProps = (dispatch) => ({
    onFaceLogin(image) {
        return dispatch(faceLoginProcess(image));
    },
    getUser() {
        return dispatch(getUserProcess());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(FaceUnlock);
